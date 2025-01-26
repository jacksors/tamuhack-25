import type { ScoringFunction } from "../types";

interface TypeMatch {
  score: number; // 0 to 1
  confidence: number; // 0 to 1
  matchType: "exact" | "related" | "none";
  notes: string[];
}

export const scoreVehicleType: ScoringFunction = async ({
  vehicle,
  preferences,
}) => {
  console.log("\n[Vehicle Type Scoring]");
  console.log("Preferred types:", preferences.vehicleTypes);
  console.log("Actual type:", vehicle.vehicleSizeClass);

  if (!preferences.vehicleTypes?.length) {
    return {
      score: 0.5, // Neutral score
      metadata: {
        confidence: 1,
        matchType: "none",
        notes: ["No vehicle type preferences specified"],
      },
    };
  }

  // Calculate match scores for each preferred type
  const typeMatches = preferences.vehicleTypes.map((preferredType) => {
    return calculateTypeMatch(preferredType, vehicle.vehicleSizeClass);
  });

  // Find the best match
  const bestMatch = typeMatches.reduce(
    (best, current) => (current.score > best.score ? current : best),
    {
      score: 0,
      confidence: 1,
      matchType: "none" as const,
      notes: [],
    },
  );

  // Apply multi-type bonus if vehicle matches multiple preferences
  const multiTypeMatches = typeMatches.filter((match) => match.score > 0.7);
  const multiTypeBonus = Math.min((multiTypeMatches.length - 1) * 0.1, 0.2); // Up to 0.2 bonus

  // Calculate final score (capped at 1)
  const finalScore = Math.max(Math.min(bestMatch.score + multiTypeBonus, 1), 0);

  return {
    score: finalScore,
    metadata: {
      confidence: bestMatch.confidence,
      matchType: bestMatch.matchType,
      notes: bestMatch.notes,
      multiTypeMatches: multiTypeMatches.length,
    },
  };
};

function calculateTypeMatch(
  preferred: string,
  actual?: string | null,
): TypeMatch {
  if (!actual) {
    return {
      score: 0,
      confidence: 1,
      matchType: "none",
      notes: ["No vehicle type information available"],
    };
  }

  const preferredLower = preferred.toLowerCase();
  const actualLower = actual.toLowerCase();

  // Direct match
  if (actualLower.includes(preferredLower)) {
    return {
      score: 1,
      confidence: 1,
      matchType: "exact",
      notes: [`Exact match: ${preferred}`],
    };
  }

  // Define type relationships with similarity scores
  const typeRelations: Record<string, Array<[string, number]>> = {
    suv: [
      ["crossover", 0.9],
      ["wagon", 0.7],
      ["minivan", 0.6],
    ],
    sedan: [
      ["coupe", 0.8],
      ["hatchback", 0.7],
      ["wagon", 0.6],
    ],
    truck: [
      ["suv", 0.6],
      ["van", 0.5],
    ],
    "hybrid/electric": [
      ["hybrid", 1],
      ["electric", 1],
      ["plug-in", 0.9],
    ],
    minivan: [
      ["van", 0.9],
      ["suv", 0.7],
      ["wagon", 0.6],
    ],
    sports: [
      ["coupe", 0.9],
      ["convertible", 0.8],
      ["performance", 0.8],
    ],
  };

  // Check for related types
  const relations = typeRelations[preferredLower] || [];
  let bestRelatedScore = 0;
  let matchingRelation = "";

  for (const [relatedType, score] of relations) {
    if (actualLower.includes(relatedType) && score > bestRelatedScore) {
      bestRelatedScore = score;
      matchingRelation = relatedType;
    }
  }

  if (bestRelatedScore > 0) {
    return {
      score: bestRelatedScore,
      confidence: 0.9,
      matchType: "related",
      notes: [
        `Related match: ${matchingRelation} is ${Math.round(bestRelatedScore * 100)}% similar to ${preferred}`,
      ],
    };
  }

  // No match
  return {
    score: 0,
    confidence: 1,
    matchType: "none",
    notes: [`No match between ${preferred} and ${actual}`],
  };
}
