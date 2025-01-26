import type { ScoringFunction } from "../types";
import { getVehicleFeatures } from "@/lib/vehicle-data/sources/openai";

export const USAGE_ANALYSIS_PROMPT = `
Analyze this vehicle's suitability for different use cases. For each use case below, provide:
- A suitability score (0-100)
- A confidence score (0-100)
- Key supporting features
- Notable limitations or concerns

Use cases to analyze:
1. Daily commuting (city driving, traffic, parking)
2. Long road trips (highway driving, comfort, range)
3. Off-road adventures (capability, durability)
4. Family transportation (safety, space, convenience)
5. Business/professional use (appearance, comfort, technology)
6. Adventure/sports activities (cargo, versatility)

Format the response as a JSON object with this structure:
{
  "useCases": {
    "useCase": {
      "score": number,
      "confidence": number,
      "features": string[],
      "limitations": string[]
    }
  }
}`;

interface UsageAnalysis {
  score: number; // 0-1 normalized
  confidence: number; // 0-1 normalized
  suitability: Record<
    string,
    {
      score: number; // 0-1 normalized
      confidence: number; // 0-1 normalized
      notes: string[];
      features: string[];
    }
  >;
}

export const scoreUsageCompatibility: ScoringFunction = async ({
  vehicle,
  preferences,
}) => {
  console.log("\n[Usage Compatibility Scoring]");
  console.log("Desired usage:", preferences.usage);

  if (!preferences.usage?.length) {
    return {
      score: 0.5, // Neutral score
      metadata: {
        confidence: 1,
        notes: [],
        usageSuitability: {},
      },
    };
  }

  // Get detailed vehicle features from OpenAI
  const featureData = await getVehicleFeatures(
    vehicle.year as string,
    vehicle.model as string,
  );

  // Analyze usage compatibility
  const analysis = await analyzeUsageCompatibility(
    vehicle,
    featureData,
    preferences.usage,
    preferences.priorities || [],
  );

  console.log("Usage analysis:", analysis);

  // Score is already normalized 0-1 from analysis
  return {
    score: analysis.score,
    metadata: {
      confidence: analysis.confidence,
      usageSuitability: analysis.suitability,
      notes: Object.entries(analysis.suitability).map(
        ([usage, data]) => `${usage}: ${data.notes.join(". ")}`,
      ),
    },
  };
};

async function analyzeUsageCompatibility(
  vehicle: any,
  featureData: Awaited<ReturnType<typeof getVehicleFeatures>>,
  userUsages: string[],
  priorities: string[],
): Promise<UsageAnalysis> {
  // Map vehicle characteristics to usage scenarios
  const suitability: UsageAnalysis["suitability"] = {};

  // Analyze each usage scenario
  for (const usage of userUsages) {
    const analysis = analyzeUsageCase(usage, vehicle, featureData);
    suitability[usage] = analysis;
  }

  // Calculate overall score using weighted average based on priorities
  const usageScores = Object.entries(suitability).map(([usage, data]) => {
    const priorityIndex = priorities.indexOf(usage);
    const priorityWeight = priorityIndex >= 0 ? 1 - priorityIndex * 0.1 : 0.5; // Higher weight for higher priority
    return {
      score: data.score,
      confidence: data.confidence,
      weight: priorityWeight,
    };
  });

  const weightedScore =
    usageScores.reduce(
      (sum, { score, confidence, weight }) => sum + score * confidence * weight,
      0,
    ) /
    usageScores.reduce(
      (sum, { confidence, weight }) => sum + confidence * weight,
      0,
    );

  const averageConfidence =
    usageScores.reduce((sum, { confidence }) => sum + confidence, 0) /
    usageScores.length;

  return {
    score: weightedScore,
    confidence: averageConfidence,
    suitability,
  };
}

function analyzeUsageCase(
  usage: string,
  vehicle: any,
  featureData: Awaited<ReturnType<typeof getVehicleFeatures>>,
): {
  score: number;
  confidence: number;
  notes: string[];
  features: string[];
} {
  switch (usage) {
    case "daily-commuting":
      return analyzeDailyCommuting(vehicle, featureData);
    case "road-trips":
      return analyzeRoadTrips(vehicle, featureData);
    case "off-roading":
      return analyzeOffRoading(vehicle, featureData);
    case "family":
      return analyzeFamilyUse(vehicle, featureData);
    case "business":
      return analyzeBusinessUse(vehicle, featureData);
    case "adventure":
      return analyzeAdventureUse(vehicle, featureData);
    default:
      return {
        score: 0.5,
        confidence: 0.5,
        notes: ["Usage scenario not specifically analyzed"],
        features: [],
      };
  }
}

function analyzeDailyCommuting(
  vehicle: any,
  featureData: Awaited<ReturnType<typeof getVehicleFeatures>>,
): {
  score: number;
  confidence: number;
  notes: string[];
  features: string[];
} {
  const relevantFeatures = [
    "fuel-efficiency",
    "safety-package",
    "lane-assist",
    "blind-spot",
    "adaptive-cruise",
  ];
  const availableFeatures = relevantFeatures.filter(
    (f) => featureData.features[f]?.available,
  );
  const notes: string[] = [];
  const features = availableFeatures;

  // Calculate base score from feature availability
  const featureScore = availableFeatures.length / relevantFeatures.length;

  // Analyze fuel efficiency
  const isHybrid = vehicle.fuelType?.toLowerCase().includes("hybrid");
  const isEfficient = vehicle.combinedMpgForFuelType1 > 30;
  if (isHybrid) {
    notes.push("Hybrid powertrain ideal for commuting");
    features.push("hybrid-powertrain");
  }
  if (isEfficient) {
    notes.push("High fuel efficiency");
    features.push("efficient-engine");
  }

  // Size and maneuverability
  const isCompact = vehicle.vehicleSizeClass?.toLowerCase().includes("compact");
  if (isCompact) {
    notes.push("Compact size good for city driving");
    features.push("compact-size");
  }

  // Calculate final normalized score
  const score =
    featureScore * 0.6 +
    (isHybrid ? 0.2 : 0) +
    (isEfficient ? 0.1 : 0) +
    (isCompact ? 0.1 : 0);

  return {
    score,
    confidence: 0.9,
    notes,
    features,
  };
}

function analyzeRoadTrips(
  vehicle: any,
  featureData: Awaited<ReturnType<typeof getVehicleFeatures>>,
): {
  score: number;
  confidence: number;
  notes: string[];
  features: string[];
} {
  const relevantFeatures = [
    "heated-seats",
    "adaptive-cruise",
    "premium-audio",
    "large-screen",
    "wireless-charging",
  ];
  const availableFeatures = relevantFeatures.filter(
    (f) => featureData.features[f]?.available,
  );
  const notes: string[] = [];
  const features = availableFeatures;

  // Calculate base score from feature availability
  const featureScore = availableFeatures.length / relevantFeatures.length;

  // Analyze range and efficiency
  const hasGoodRange = vehicle.rangeForFuelType1 > 400;
  const isEfficient = vehicle.combinedMpgForFuelType1 > 30;
  if (hasGoodRange) {
    notes.push("Excellent driving range");
    features.push("long-range");
  }
  if (isEfficient) {
    notes.push("Good fuel efficiency for long trips");
    features.push("efficient-engine");
  }

  // Space and comfort
  const hasAmpleSpace =
    vehicle.vehicleSizeClass?.toLowerCase().includes("suv") ||
    vehicle.vehicleSizeClass?.toLowerCase().includes("sedan");
  if (hasAmpleSpace) {
    notes.push("Comfortable size for long trips");
    features.push("ample-space");
  }

  // Calculate final normalized score
  const score =
    featureScore * 0.5 +
    (hasGoodRange ? 0.2 : 0) +
    (isEfficient ? 0.2 : 0) +
    (hasAmpleSpace ? 0.1 : 0);

  return {
    score,
    confidence: 0.9,
    notes,
    features,
  };
}

function analyzeOffRoading(
  vehicle: any,
  featureData: Awaited<ReturnType<typeof getVehicleFeatures>>,
): {
  score: number;
  confidence: number;
  notes: string[];
  features: string[];
} {
  const relevantFeatures = ["awd", "towing", "adaptive-suspension"];
  const availableFeatures = relevantFeatures.filter(
    (f) => featureData.features[f]?.available,
  );
  const notes: string[] = [];
  const features = availableFeatures;

  // Calculate base score from feature availability
  const featureScore = availableFeatures.length / relevantFeatures.length;

  // Analyze drivetrain
  const hasAWD =
    vehicle.drive?.toLowerCase().includes("awd") ||
    vehicle.drive?.toLowerCase().includes("4wd");
  if (hasAWD) {
    notes.push("AWD/4WD capability");
    features.push("awd-system");
  }

  // Vehicle type suitability
  const isSUV = vehicle.vehicleSizeClass?.toLowerCase().includes("suv");
  const isTruck = vehicle.vehicleSizeClass?.toLowerCase().includes("truck");
  if (isSUV || isTruck) {
    notes.push(`${isSUV ? "SUV" : "Truck"} body style suitable for off-road`);
    features.push(isSUV ? "suv-body" : "truck-body");
  }

  // Calculate final normalized score
  const score =
    featureScore * 0.4 + (hasAWD ? 0.4 : 0) + (isSUV || isTruck ? 0.2 : 0);

  return {
    score,
    confidence: 0.8,
    notes,
    features,
  };
}

function analyzeFamilyUse(
  vehicle: any,
  featureData: Awaited<ReturnType<typeof getVehicleFeatures>>,
): {
  score: number;
  confidence: number;
  notes: string[];
  features: string[];
} {
  const relevantFeatures = [
    "third-row",
    "safety-package",
    "blind-spot",
    "lane-assist",
    "wireless-charging",
  ];
  const availableFeatures = relevantFeatures.filter(
    (f) => featureData.features[f]?.available,
  );
  const notes: string[] = [];
  const features = availableFeatures;

  // Calculate base score from feature availability
  const featureScore = availableFeatures.length / relevantFeatures.length;

  // Analyze space and seating
  const hasThirdRow = featureData.features["third-row"]?.available;
  const isFamilySize =
    vehicle.vehicleSizeClass?.toLowerCase().includes("suv") ||
    vehicle.vehicleSizeClass?.toLowerCase().includes("minivan");

  if (hasThirdRow) {
    notes.push("Third row seating available");
    features.push("third-row");
  }
  if (isFamilySize) {
    notes.push("Family-friendly size");
    features.push("family-size");
  }

  // Safety features
  const hasSafetyFeatures = featureData.features["safety-package"]?.available;
  if (hasSafetyFeatures) {
    notes.push("Advanced safety features");
    features.push("safety-package");
  }

  // Calculate final normalized score
  const score =
    featureScore * 0.4 +
    (hasThirdRow ? 0.3 : 0) +
    (isFamilySize ? 0.2 : 0) +
    (hasSafetyFeatures ? 0.1 : 0);

  return {
    score,
    confidence: 0.9,
    notes,
    features,
  };
}

function analyzeBusinessUse(
  vehicle: any,
  featureData: Awaited<ReturnType<typeof getVehicleFeatures>>,
): {
  score: number;
  confidence: number;
  notes: string[];
  features: string[];
} {
  const relevantFeatures = [
    "premium-audio",
    "heated-seats",
    "large-screen",
    "wireless-charging",
    "heads-up",
  ];
  const availableFeatures = relevantFeatures.filter(
    (f) => featureData.features[f]?.available,
  );
  const notes: string[] = [];
  const features = availableFeatures;

  // Calculate base score from feature availability
  const featureScore = availableFeatures.length / relevantFeatures.length;

  // Analyze vehicle type
  const isLuxury = vehicle.vehicleSizeClass?.toLowerCase().includes("luxury");
  const isSedan = vehicle.vehicleSizeClass?.toLowerCase().includes("sedan");
  if (isLuxury) {
    notes.push("Luxury vehicle suitable for business");
    features.push("luxury-class");
  }
  if (isSedan) {
    notes.push("Professional sedan styling");
    features.push("sedan-body");
  }

  // Premium features
  const hasPremiumFeatures = featureData.features["premium-audio"]?.available;
  if (hasPremiumFeatures) {
    notes.push("Premium amenities");
    features.push("premium-features");
  }

  // Calculate final normalized score
  const score =
    featureScore * 0.4 +
    (isLuxury ? 0.3 : 0) +
    (isSedan ? 0.2 : 0) +
    (hasPremiumFeatures ? 0.1 : 0);

  return {
    score,
    confidence: 0.85,
    notes,
    features,
  };
}

function analyzeAdventureUse(
  vehicle: any,
  featureData: Awaited<ReturnType<typeof getVehicleFeatures>>,
): {
  score: number;
  confidence: number;
  notes: string[];
  features: string[];
} {
  const relevantFeatures = [
    "awd",
    "towing",
    "adaptive-suspension",
    "roof-rack",
  ];
  const availableFeatures = relevantFeatures.filter(
    (f) => featureData.features[f]?.available,
  );
  const notes: string[] = [];
  const features = availableFeatures;

  // Calculate base score from feature availability
  const featureScore = availableFeatures.length / relevantFeatures.length;

  // Analyze capability
  const hasAWD =
    vehicle.drive?.toLowerCase().includes("awd") ||
    vehicle.drive?.toLowerCase().includes("4wd");
  const hasTowing = featureData.features["towing"]?.available;

  if (hasAWD) {
    notes.push("AWD/4WD capability");
    features.push("awd-system");
  }
  if (hasTowing) {
    notes.push("Towing capability");
    features.push("towing-package");
  }

  // Vehicle type suitability
  const isAdventureSuitable =
    vehicle.vehicleSizeClass?.toLowerCase().includes("suv") ||
    vehicle.vehicleSizeClass?.toLowerCase().includes("crossover");
  if (isAdventureSuitable) {
    notes.push("Adventure-ready body style");
    features.push("adventure-body");
  }

  // Calculate final normalized score
  const score =
    featureScore * 0.3 +
    (hasAWD ? 0.3 : 0) +
    (hasTowing ? 0.2 : 0) +
    (isAdventureSuitable ? 0.2 : 0);

  return {
    score,
    confidence: 0.85,
    notes,
    features,
  };
}
