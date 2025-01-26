import type { ScoringFunction, ScoringResult } from "../types";
import { normalizeScore } from "../utils";
import { getVehicleFeatures } from "@/lib/vehicle-data/sources/openai";

interface FeatureAnalysis {
  score: number;
  matching: string[];
  missing: string[];
  confidence: number;
  notes: Record<string, string>;
}

export const scoreFeatureAlignment: ScoringFunction = async ({
  vehicle,
  preferences,
  weights,
  normalizer,
}) => {
  console.log("\n[Feature Alignment Scoring]");
  console.log("Desired features:", preferences.features);
  if (!preferences.features?.length) {
    return {
      score: normalizeScore(50, {
        ...normalizer,
        weight: weights.featureAlignment,
      }),
      metadata: {
        matching: [],
        missing: [],
        notes: {},
        confidence: 1,
      },
    };
  }

  // Get features directly from OpenAI
  const featureData = await getVehicleFeatures(
    vehicle.year as string,
    vehicle.model as string,
  );

  console.log(
    "Available features:",
    Object.keys(featureData.features).filter(
      (k) => featureData.features[k]?.available,
    ),
  );

  const analysis = analyzeFeatures(featureData, preferences.features);

  // Calculate weighted score based on matching vs missing features
  let score = (analysis.matching.length / preferences.features.length) * 100;

  // Weight the score by our confidence
  score *= analysis.confidence;

  // Apply bonuses and penalties
  if (analysis.missing.length === 0) {
    score *= 1.2; // 20% bonus for having all requested features
  }

  // Penalty for missing critical features (based on user priorities)
  const criticalFeatures = preferences.priorities?.slice(0, 3) || [];
  const missingCritical = analysis.missing.filter((feature) =>
    criticalFeatures.some((critical) => feature.includes(critical)),
  );

  if (missingCritical.length > 0) {
    score *= 0.8; // 20% penalty for missing critical features
  }

  return {
    score: normalizeScore(score, {
      ...normalizer,
      weight: weights.featureAlignment,
    }),
    metadata: {
      matching: analysis.matching,
      missing: analysis.missing,
      notes: analysis.notes,
      confidence: analysis.confidence,
    },
  };
};

function analyzeFeatures(
  featureData: Awaited<ReturnType<typeof getVehicleFeatures>>,
  desiredFeatures: string[],
): FeatureAnalysis {
  const matching: string[] = [];
  const missing: string[] = [];
  const notes: Record<string, string> = {};
  let totalConfidence = 0;

  for (const feature of desiredFeatures) {
    const featureInfo = featureData.features[feature];

    if (featureInfo) {
      if (featureInfo.available) {
        matching.push(feature);
        if (featureInfo.notes) {
          notes[feature] = featureInfo.notes;
        }
      } else {
        missing.push(feature);
      }
      totalConfidence += featureInfo.confidence;
    } else {
      missing.push(feature);
      totalConfidence += 0.5; // Neutral confidence for unknown features
    }
  }

  const confidence = totalConfidence / desiredFeatures.length;

  return {
    score: (matching.length / desiredFeatures.length) * 100,
    matching,
    missing,
    confidence,
    notes,
  };
}
