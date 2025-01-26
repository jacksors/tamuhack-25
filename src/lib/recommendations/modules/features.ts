import type { ScoringFunction } from "../types";
import { getVehicleFeatures } from "@/lib/vehicle-data/sources/openai";

interface FeatureAnalysis {
  score: number; // 0 to 1
  confidence: number; // 0 to 1
  matching: string[];
  missing: string[];
  notes: string[];
  categoryScores: Record<string, number>;
}

export const scoreFeatureAlignment: ScoringFunction = async ({
  vehicle,
  preferences,
}) => {
  console.log("\n[Feature Alignment Scoring]");
  console.log("Desired features:", preferences.features);

  if (!preferences.features?.length) {
    return {
      score: 0.5, // Neutral score
      metadata: {
        confidence: 1,
        matching: [],
        missing: [],
        notes: [],
        categoryScores: {},
      },
    };
  }

  // Get features from OpenAI
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

  const analysis = analyzeFeatures(
    featureData,
    preferences.features,
    preferences.priorities || [],
  );

  return {
    score: analysis.score,
    metadata: {
      confidence: analysis.confidence,
      matching: analysis.matching,
      missing: analysis.missing,
      notes: analysis.notes as string[],
      categoryScores: analysis.categoryScores,
    },
  };
};

function analyzeFeatures(
  featureData: Awaited<ReturnType<typeof getVehicleFeatures>>,
  desiredFeatures: string[],
  priorities: string[],
): FeatureAnalysis {
  const matching: string[] = [];
  const missing: string[] = [];
  const notes: string[] = [];
  const categoryScores: Record<string, number> = {};
  let totalConfidence = 0;

  // Group features by category
  const categories = {
    safety: ["safety-package", "lane-assist", "blind-spot", "awd"],
    comfort: ["sunroof", "heated-seats", "third-row", "wireless-charging"],
    technology: ["large-screen", "premium-audio", "smartphone", "heads-up"],
    performance: [
      "towing",
      "sport-mode",
      "adaptive-suspension",
      "paddle-shifters",
    ],
  };

  // Track matches by category
  const categoryMatches: Record<string, { matched: number; total: number }> =
    {};

  // Analyze each desired feature
  for (const feature of desiredFeatures) {
    const featureInfo = featureData.features[feature];

    if (featureInfo) {
      if (featureInfo.available) {
        matching.push(feature);
        if (featureInfo.notes) {
          notes.push(featureInfo.notes);
        }

        // Update category matches
        for (const [category, features] of Object.entries(categories)) {
          if (features.includes(feature)) {
            categoryMatches[category] = categoryMatches[category] || {
              matched: 0,
              total: 0,
            };
            categoryMatches[category].matched++;
            categoryMatches[category].total++;
          }
        }
      } else {
        missing.push(feature);
        // Update category totals for missing features
        for (const [category, features] of Object.entries(categories)) {
          if (features.includes(feature)) {
            categoryMatches[category] = categoryMatches[category] || {
              matched: 0,
              total: 0,
            };
            categoryMatches[category].total++;
          }
        }
      }
      totalConfidence += featureInfo.confidence;
    } else {
      missing.push(feature);
      totalConfidence += 0.5; // Neutral confidence for unknown features
    }
  }

  // Calculate category scores
  for (const [category, counts] of Object.entries(categoryMatches)) {
    categoryScores[category] =
      counts.total > 0 ? counts.matched / counts.total : 0;
  }

  // Calculate base score from match ratio
  const baseScore = matching.length / desiredFeatures.length;

  // Calculate priority bonus
  const priorityBonus = calculatePriorityBonus(matching, priorities);

  // Calculate category bonus
  const categoryBonus = calculateCategoryBonus(categoryScores);

  // Calculate final score
  const finalScore = Math.min(
    baseScore * (1 + priorityBonus + categoryBonus),
    1,
  );

  return {
    score: finalScore,
    confidence: totalConfidence / desiredFeatures.length,
    matching,
    missing,
    notes,
    categoryScores,
  };
}

function calculatePriorityBonus(
  matching: string[],
  priorities: string[],
): number {
  if (!priorities.length) return 0;

  // Calculate bonus based on matching high-priority features
  const priorityMatches = priorities
    .slice(0, 3)
    .filter((priority) =>
      matching.some((feature) =>
        feature.toLowerCase().includes(priority.toLowerCase()),
      ),
    );

  return (priorityMatches.length / 3) * 0.15; // Up to 15% bonus for priority matches
}

function calculateCategoryBonus(
  categoryScores: Record<string, number>,
): number {
  // Bonus for having good coverage across categories
  const categories = Object.values(categoryScores);
  if (!categories.length) return 0;

  const averageCategoryScore =
    categories.reduce((sum, score) => sum + score, 0) / categories.length;
  const categoryVariance = Math.sqrt(
    categories.reduce(
      (sum, score) => sum + Math.pow(score - averageCategoryScore, 2),
      0,
    ) / categories.length,
  );

  // Higher bonus for balanced feature distribution
  return averageCategoryScore * (1 - categoryVariance) * 0.1; // Up to 10% bonus
}
