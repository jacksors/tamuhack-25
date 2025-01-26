import type {
  VehicleScore,
  ScoringWeights,
  UserPreferences,
  ScoreNormalizer,
} from "./types";
import {
  DEFAULT_WEIGHTS,
  DEFAULT_NORMALIZER,
  calculateConfidenceScore,
} from "./utils";
import { scoreVehicleType } from "./modules/vehicle-type";
import { scorePriceCompatibility } from "./modules/price";
import { scoreFeatureAlignment } from "./modules/features";
import { scorePassengerCapacity } from "./modules/passengers";
import { scoreUsageCompatibility } from "./modules/usage";
import db from "@/server/db";
import { desc } from "drizzle-orm";
import { vehiclesTable } from "@/server/db/schema";
import { NullableToOptional, nullableToOptional } from "@/lib/utils";
import fs from "node:fs";
import { scoreFuelTypeMatch } from "@/lib/recommendations/modules/fuel-type";

export class RecommendationEngine {
  private weights: ScoringWeights;
  private normalizer: ScoreNormalizer;

  constructor(
    weights: Partial<ScoringWeights> = {},
    normalizer: Partial<ScoreNormalizer> = {},
  ) {
    this.weights = { ...DEFAULT_WEIGHTS, ...weights };
    this.normalizer = { ...DEFAULT_NORMALIZER, ...normalizer };
  }

  async getRecommendations(
    preferences: UserPreferences,
    limit = 10,
  ): Promise<VehicleScore[]> {
    const vehicles = await db
      .select()
      .from(vehiclesTable)
      .orderBy(desc(vehiclesTable.msrp));

    const scores = await Promise.all(
      vehicles
        .map(nullableToOptional)
        .map((vehicle) => this.scoreVehicle(vehicle, preferences)),
    );

    // Filter out vehicles with very low scores before sorting
    const viableScores = scores.filter((score) => score.totalScore > -1);

    fs.writeFileSync("recs.json", JSON.stringify(viableScores));

    return viableScores.sort((a, b) => b.totalScore - a.totalScore);
  }

  private async scoreVehicle(
    vehicle: NullableToOptional<typeof vehiclesTable.$inferSelect>,
    preferences: UserPreferences,
  ): Promise<VehicleScore> {
    console.log(`\n[Scoring] ${vehicle.year} ${vehicle.make} ${vehicle.model}`);
    console.log("Preferences:", JSON.stringify(preferences, null, 2));

    const scoringParams = {
      vehicle,
      preferences,
      weights: this.weights,
      normalizer: this.normalizer,
    };

    // Get scores and metadata from each module
    const [
      typeScore,
      priceScore,
      featureScore,
      passengerScore,
      usageScore,
      fuelScore,
    ] = await Promise.all([
      scoreVehicleType(scoringParams),
      scorePriceCompatibility(scoringParams),
      scoreFeatureAlignment(scoringParams),
      scorePassengerCapacity(scoringParams),
      scoreUsageCompatibility(scoringParams),
      scoreFuelTypeMatch(scoringParams),
    ]);

    // Calculate factors object with just the scores
    const factors = {
      vehicleTypeMatch: typeScore.score,
      priceCompatibility: priceScore.score,
      featureAlignment: featureScore.score,
      passengerFit: passengerScore.score,
      fuelTypeMatch: fuelScore.score,
      usageCompatibility: usageScore.score,
      locationFactor: 0, // To be implemented
    };

    // Calculate weighted average score with exponential scaling
    let totalScore =
      Object.entries(factors).reduce((sum, [key, score]) => {
        const weight = this.weights[key as keyof ScoringWeights];
        return sum + score * weight;
      }, 0) * 100;

    // Calculate confidence score using metadata from all modules
    const confidenceScore = calculateConfidenceScore({
      ...factors,
      typeConfidence: typeScore.metadata?.confidence || 1,
      featureConfidence: featureScore.metadata?.confidence || 1,
      passengerConfidence: passengerScore.metadata?.confidence || 1,
    });

    // Transform usage notes from Record to array
    const usageAnalysis = usageScore.metadata?.notes
      ? Object.entries(usageScore.metadata.notes).map(
          ([useCase, note]) => `${useCase}: ${note}`,
        )
      : [];

    console.log("\nScoring Results:", {
      vehicleId: vehicle.id,
      totalScore,
      confidenceScore,
      factors,
      matchingFeatures: featureScore.metadata?.matching,
      missingFeatures: featureScore.metadata?.missing,
      priceAnalysis: {
        isWithinBudget: priceScore.metadata?.isWithinBudget,
        percentageFromBudget: priceScore.metadata?.percentageFromBudget,
      },
      passengerAnalysis: passengerScore.metadata?.actualCapacity
        ? {
            actualCapacity: passengerScore.metadata.actualCapacity,
            configuration: passengerScore.metadata.configuration,
            notes: passengerScore.metadata.passengerNotes,
          }
        : undefined,
      usageAnalysis,
    });

    return {
      vehicleId: vehicle.id || "",
      vehicle,
      totalScore,
      confidenceScore,
      factors,
      metadata: {
        matchingFeatures: featureScore.metadata?.matching || [],
        missingFeatures: featureScore.metadata?.missing || [],
        featureNotes: featureScore.metadata?.notes || [],
        priceAnalysis: {
          isWithinBudget: priceScore.metadata?.isWithinBudget || false,
          percentageFromBudget: priceScore.metadata?.percentageFromBudget || 0,
        },
        passengerAnalysis: passengerScore.metadata?.actualCapacity
          ? {
              actualCapacity: passengerScore.metadata.actualCapacity,
              configuration:
                passengerScore.metadata.configuration || "standard",
              notes: passengerScore.metadata.passengerNotes || "",
            }
          : undefined,
        usageAnalysis,
      },
    };
  }
}
