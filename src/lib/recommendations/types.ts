import db from "@/server/db";
import type { vehiclesTable } from "@/server/db/schema";
import type { NullableToOptional } from "@/lib/utils";
import { relations, type InferSelectModel } from "drizzle-orm"

export interface VehicleScore {
  vehicleId: string;
  vehicle: NullableToOptional<typeof vehiclesTable.$inferSelect>;
  totalScore: number;
  confidenceScore: number;
  factors: {
    vehicleTypeMatch: number;
    priceCompatibility: number;
    featureAlignment: number;
    passengerFit: number;
    fuelTypeMatch: number;
    usageCompatibility: number;
    locationFactor: number;
  };
  metadata: {
    matchingFeatures: string[];
    missingFeatures: string[];
    featureNotes: string[];
    priceAnalysis: {
      isWithinBudget: boolean;
      percentageFromBudget: number;
    };
    passengerAnalysis?: {
      actualCapacity: number;
      configuration: string;
      notes: string;
    };
    usageAnalysis: string[];
  };
}

export interface ScoringWeights {
  vehicleTypeMatch: number;
  priceCompatibility: number;
  featureAlignment: number;
  passengerFit: number;
  fuelTypeMatch: number;
  usageCompatibility: number;
  locationFactor: number;
}

export interface ScoreNormalizer {
  min: number;
  max: number;
  weight: number;
}

export interface ScoringResult {
  score: number;
  metadata?: {
    matching?: string[];
    missing?: string[];
    notes?: string[];
    isWithinBudget?: boolean;
    percentageFromBudget?: number;
    confidence?: number;
    actualCapacity?: number;
    configuration?: string;
    passengerNotes?: string;
    usageSuitability?: Record<
      string,
      {
        score: number;
        confidence: number;
        notes: string[];
      }
    >;
  };
}

export type ScoringFunction = (params: ScoringParams) => Promise<ScoringResult>;

export interface ScoringParams {
  vehicle: NullableToOptional<typeof vehiclesTable.$inferSelect>;
  preferences: UserPreferences;
  weights: ScoringWeights;
  normalizer: ScoreNormalizer;
}

export interface UserPreferences {
  vehicleTypes: string[];
  otherVehicleType?: string;
  usage?: string[];
  priorities?: string[];
  features?: string[];
  fuelPreference?: string;
  passengerCount?: number;
  paymentPlan?: {
    type: string;
    budget?: number;
    monthlyPayment?: number;
    creditScore?: string;
    downPayment?: number;
  };
  location?: string;
}

export type Vehicle = InferSelectModel<typeof vehiclesTable>;