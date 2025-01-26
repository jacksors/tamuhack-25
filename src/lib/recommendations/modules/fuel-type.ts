import type { ScoringFunction } from "../types";

interface FuelTypeMatch {
  score: number; // 0 to 1
  confidence: number; // 0 to 1
  matchType: "exact" | "related" | "alternative" | "none";
  notes: string[];
  alternativeOptions: string[];
}

export const scoreFuelTypeMatch: ScoringFunction = async ({
  vehicle,
  preferences,
}) => {
  console.log("\n[Fuel Type Scoring]");
  console.log("Preferred fuel type:", preferences.fuelPreference);
  console.log("Vehicle fuel types:", {
    main: vehicle.fuelType,
    type1: vehicle.fuelType1,
    type2: vehicle.fuelType2,
  });

  if (!preferences.fuelPreference) {
    return {
      score: 0.5, // Neutral score
      metadata: {
        confidence: 1,
        matchType: "none",
        notes: ["No fuel type preference specified"],
        alternativeOptions: [],
      },
    };
  }

  const analysis = analyzeFuelTypeMatch(
    preferences.fuelPreference,
    vehicle.fuelType,
    vehicle.fuelType1,
    vehicle.fuelType2,
  );

  console.log("Fuel type analysis:", analysis);

  return {
    score: analysis.score,
    metadata: {
      confidence: analysis.confidence,
      matchType: analysis.matchType,
      notes: analysis.notes,
      alternativeOptions: analysis.alternativeOptions,
    },
  };
};

function analyzeFuelTypeMatch(
  preferred: string,
  mainType?: string | null,
  type1?: string | null,
  type2?: string | null,
): FuelTypeMatch {
  const fuelTypes = new Set([
    ...(mainType ? [mainType.toLowerCase()] : []),
    ...(type1 ? [type1.toLowerCase()] : []),
    ...(type2 ? [type2.toLowerCase()] : []),
  ]);

  const preferredLower = preferred.toLowerCase();
  const notes: string[] = [];
  const alternativeOptions: string[] = [];

  // Special case for "no preference"
  if (preferredLower === "no-preference") {
    return {
      score: 0.75,
      confidence: 1,
      matchType: "alternative",
      notes: ["No specific fuel type preference"],
      alternativeOptions: Array.from(fuelTypes),
    };
  }

  // Define fuel type compatibility matrix
  const fuelCompatibility: Record<string, Array<[string, number, string]>> = {
    gasoline: [
      ["gas", 1, "Standard gasoline engine"],
      ["hybrid", 0.9, "Hybrid powertrain with gasoline engine"],
      ["plug-in hybrid", 0.8, "Plug-in hybrid with gasoline engine"],
      ["flex", 0.7, "Flex-fuel capability"],
    ],
    hybrid: [
      ["hybrid", 1, "Hybrid powertrain"],
      ["plug-in hybrid", 0.9, "Advanced plug-in hybrid system"],
      ["gas", 0.7, "Conventional gasoline engine"],
      ["electric", 0.6, "Full electric powertrain"],
    ],
    electric: [
      ["electric", 1, "Full electric powertrain"],
      ["plug-in hybrid", 0.8, "Plug-in hybrid capability"],
      ["hybrid", 0.6, "Hybrid powertrain"],
      ["fuel cell", 0.9, "Hydrogen fuel cell"],
    ],
    diesel: [
      ["diesel", 1, "Diesel engine"],
      ["biodiesel", 0.9, "Biodiesel compatible"],
      ["hybrid diesel", 0.8, "Diesel hybrid system"],
    ],
  };

  // Check for exact match
  const hasExactMatch = Array.from(fuelTypes).some((type) => {
    const isMatch = type.includes(preferredLower);
    if (isMatch) {
      notes.push(`Exact match: ${type}`);
    }
    return isMatch;
  });

  if (hasExactMatch) {
    return {
      score: 1,
      confidence: 1,
      matchType: "exact",
      notes,
      alternativeOptions,
    };
  }

  // Find best alternative match
  let bestScore = 0;
  const compatibility = fuelCompatibility[preferredLower] || [];

  for (const type of fuelTypes) {
    for (const [compatType, score, note] of compatibility) {
      if (type.includes(compatType) && score > bestScore) {
        bestScore = score;
        notes.push(note);
        alternativeOptions.push(type);
      }
    }
  }

  // Apply bonuses
  let finalScore = bestScore;

  // Multi-fuel bonus
  if (fuelTypes.size > 1) {
    const multiFuelBonus = 0.1; // 10% bonus for flexibility
    finalScore = Math.min(finalScore * (1 + multiFuelBonus), 1);
    notes.push(
      `Multiple fuel options available (+${Math.round(multiFuelBonus * 100)}% bonus)`,
    );
  }

  // Efficiency bonus for hybrids and electric
  if (fuelTypes.has("hybrid") || fuelTypes.has("electric")) {
    const efficiencyBonus = 0.05; // 5% bonus for efficiency
    finalScore = Math.min(finalScore * (1 + efficiencyBonus), 1);
    notes.push(
      `Efficient powertrain option (+${Math.round(efficiencyBonus * 100)}% bonus)`,
    );
  }

  return {
    score: finalScore,
    confidence: 0.9,
    matchType: bestScore > 0 ? "related" : "none",
    notes,
    alternativeOptions,
  };
}
