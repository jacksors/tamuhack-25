import type { ScoringFunction } from "../types";
import { normalizeScore } from "../utils";

export const scoreVehicleType: ScoringFunction = async ({
  vehicle,
  preferences,
  weights,
  normalizer,
}) => {
  if (!preferences.vehicleTypes?.length) {
    return {
      score: 0,
      metadata: {
        confidence: 1,
      },
    };
  }

  const typeMatches = preferences.vehicleTypes.map((preferredType) => {
    if (
      vehicle.vehicleSizeClass
        ?.toLowerCase()
        .includes(preferredType.toLowerCase())
    ) {
      return { score: 1, confidence: 1 };
    }

    const matchScore = calculateTypeMatchScore(
      preferredType,
      vehicle.vehicleSizeClass ?? "",
    );
    return { score: matchScore, confidence: 0.8 }; // Slightly lower confidence for fuzzy matches
  });

  const bestMatch = typeMatches.reduce(
    (best, current) => (current.score > best.score ? current : best),
    {
      score: 0,
      confidence: 1,
    },
  );

  return {
    score: normalizeScore(bestMatch.score, {
      ...normalizer,
      weight: weights.vehicleType,
    }),
    metadata: {
      confidence: bestMatch.confidence,
    },
  };
};

function calculateTypeMatchScore(preferred: string, actual: string): number {
  // Define related vehicle types and their similarity scores
  const typeRelations: Record<string, Record<string, number>> = {
    suv: {
      crossover: 0.9,
      wagon: 0.7,
      minivan: 0.6,
    },
    sedan: {
      coupe: 0.8,
      hatchback: 0.7,
      wagon: 0.6,
    },
    truck: {
      suv: 0.6,
      van: 0.5,
    },
    "hybrid/electric": {
      // This is more about powertrain than body style
      // Will be handled by fuel type scoring
      suv: 1,
      sedan: 1,
      hatchback: 1,
    },
  };

  const preferredLower = preferred.toLowerCase();
  const actualLower = actual?.toLowerCase() || "";

  // Direct match
  if (actualLower.includes(preferredLower)) {
    return 1;
  }

  // Check related types
  const relations = typeRelations[preferredLower];
  if (relations) {
    for (const [relatedType, score] of Object.entries(relations)) {
      if (actualLower.includes(relatedType)) {
        return score;
      }
    }
  }

  return 0;
}
