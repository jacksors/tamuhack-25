import type { ScoringFunction } from "../types";
import { normalizeScore } from "../utils";
import { getVehicleFeatures } from "@/lib/vehicle-data/sources/openai";

interface UsageAnalysis {
  score: number;
  confidence: number;
  suitability: Record<
    string,
    {
      score: number;
      confidence: number;
      notes: string;
    }
  >;
}

// This will be used in the OpenAI prompt
export const USAGE_ANALYSIS_PROMPT = `
Analyze how well this vehicle suits the following use cases. For each use case, provide:
- A suitability score (0-100)
- A confidence score (0-1)
- Brief notes explaining the rating

Use cases to evaluate:
- Daily commuting: Efficiency, maneuverability, comfort for regular use
- Long road trips: Comfort, range/efficiency, cargo space
- Off-roading: Ground clearance, 4WD/AWD capability, durability
- Family transportation: Safety features, space, ease of access
- Business purposes: Professional appearance, comfort, reliability
- Adventure/Sports: Cargo capacity, roof rails, versatility

Consider the vehicle's:
- Size class
- Drivetrain
- Fuel efficiency
- Available features
- Interior space
- Ground clearance
- Overall design

Format response as a JSON object with this structure:
{
  useCases: {
    [useCase: string]: {
      score: number,
      confidence: number,
      notes: string
    }
  }
}
`;

export const scoreUsageCompatibility: ScoringFunction = async ({
  vehicle,
  preferences,
  weights,
  normalizer,
}) => {
  console.log("\n[Usage Compatibility Scoring]");
  console.log("Desired usage:", preferences.usage);
  if (!preferences.usage?.length) {
    return {
      score: normalizeScore(50, {
        ...normalizer,
        weight: weights.usageCompatibility,
      }),
      metadata: {
        confidence: 1,
        notes: {},
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

  console.log("Usage analysis:", analysis.suitability);

  // Calculate weighted score based on user's priorities
  const priorityBonus = calculatePriorityBonus(
    preferences.usage,
    preferences.priorities || [],
  );

  const finalScore = analysis.score * (1 + priorityBonus);

  // Convert array of notes to Record<string, string>
  const notesRecord: Record<string, string> = {};
  Object.entries(analysis.suitability)
    .filter(([useCase]) => preferences.usage?.includes(useCase))
    .forEach(([useCase, data]) => {
      notesRecord[useCase] = data.notes;
    });

  return {
    score: normalizeScore(finalScore, {
      ...normalizer,
      weight: weights.usageCompatibility,
    }),
    metadata: {
      confidence: analysis.confidence,
      usageSuitability: analysis.suitability,
      notes: notesRecord,
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

  for (const usage of userUsages) {
    const analysis = analyzeUsageCase(usage, vehicle, featureData);
    suitability[usage] = analysis;
  }

  // Calculate overall score and confidence
  const usageScores = Object.values(suitability);
  const weightedScore =
    usageScores.reduce(
      (sum, { score, confidence }) => sum + score * confidence,
      0,
    ) / usageScores.reduce((sum, { confidence }) => sum + confidence, 0);

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
): { score: number; confidence: number; notes: string } {
  // Base analysis on vehicle characteristics and features
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
        score: 50,
        confidence: 0.5,
        notes: "Usage scenario not specifically analyzed",
      };
  }
}

function calculatePriorityBonus(
  usages: string[],
  priorities: string[],
): number {
  // Calculate bonus based on how many usage scenarios align with top priorities
  const topPriorities = new Set(priorities.slice(0, 3));
  const alignedPriorities = usages.filter((usage) => topPriorities.has(usage));
  return alignedPriorities.length * 0.1; // 10% bonus per aligned priority
}

// Individual usage analysis functions
function analyzeDailyCommuting(
  vehicle: any,
  featureData: Awaited<ReturnType<typeof getVehicleFeatures>>,
): { score: number; confidence: number; notes: string } {
  const hasEfficiencyFeatures =
    featureData.features["fuel-efficiency"]?.available || false;
  const hasSafetyFeatures =
    featureData.features["safety-package"]?.available || false;
  const isHybrid = vehicle.fuelType?.toLowerCase().includes("hybrid");

  let score = 70; // Base score
  const notes = [];

  // Adjust score based on characteristics
  if (isHybrid) {
    score += 15;
    notes.push("Hybrid powertrain ideal for commuting");
  }

  if (hasEfficiencyFeatures) {
    score += 10;
    notes.push("Efficient driving features");
  }

  if (hasSafetyFeatures) {
    score += 5;
    notes.push("Advanced safety features");
  }

  // Size class considerations
  if (vehicle.vehicleSizeClass?.toLowerCase().includes("compact")) {
    score += 10;
    notes.push("Compact size good for city driving");
  }

  return {
    score: Math.min(100, score),
    confidence: 0.9,
    notes: notes.join(". "),
  };
}

function analyzeRoadTrips(
  vehicle: any,
  featureData: Awaited<ReturnType<typeof getVehicleFeatures>>,
): { score: number; confidence: number; notes: string } {
  const hasComfortFeatures =
    featureData.features["heated-seats"]?.available || false;
  const hasCruiseControl =
    featureData.features["adaptive-cruise"]?.available || false;

  let score = 70;
  const notes = [];

  if (hasComfortFeatures) {
    score += 10;
    notes.push("Comfort features for long drives");
  }

  if (hasCruiseControl) {
    score += 10;
    notes.push("Advanced cruise control");
  }

  // Consider fuel efficiency
  if (vehicle.combinedMpgForFuelType1 > 30) {
    score += 10;
    notes.push("Excellent fuel efficiency");
  }

  return {
    score: Math.min(100, score),
    confidence: 0.85,
    notes: notes.join(". "),
  };
}

function analyzeOffRoading(
  vehicle: any,
  featureData: Awaited<ReturnType<typeof getVehicleFeatures>>,
): { score: number; confidence: number; notes: string } {
  const hasAWD =
    vehicle.drive?.toLowerCase().includes("awd") ||
    vehicle.drive?.toLowerCase().includes("4wd");
  const hasTowingCapability =
    featureData.features["towing"]?.available || false;

  let score = 50;
  const notes = [];

  if (hasAWD) {
    score += 25;
    notes.push("AWD/4WD capability");
  }

  if (hasTowingCapability) {
    score += 15;
    notes.push("Towing capability");
  }

  // Vehicle type considerations
  if (vehicle.vehicleSizeClass?.toLowerCase().includes("suv")) {
    score += 10;
    notes.push("SUV body style");
  }

  return {
    score: Math.min(100, score),
    confidence: 0.8,
    notes: notes.join(". "),
  };
}

function analyzeFamilyUse(
  vehicle: any,
  featureData: Awaited<ReturnType<typeof getVehicleFeatures>>,
): { score: number; confidence: number; notes: string } {
  const hasThirdRow = featureData.features["third-row"]?.available || false;
  const hasSafetyFeatures =
    featureData.features["safety-package"]?.available || false;

  let score = 60;
  const notes = [];

  if (hasThirdRow) {
    score += 20;
    notes.push("Third row seating available");
  }

  if (hasSafetyFeatures) {
    score += 20;
    notes.push("Advanced safety features");
  }

  // Vehicle size considerations
  if (
    vehicle.vehicleSizeClass?.toLowerCase().includes("suv") ||
    vehicle.vehicleSizeClass?.toLowerCase().includes("minivan")
  ) {
    score += 10;
    notes.push("Family-friendly size");
  }

  return {
    score: Math.min(100, score),
    confidence: 0.9,
    notes: notes.join(". "),
  };
}

function analyzeBusinessUse(
  vehicle: any,
  featureData: Awaited<ReturnType<typeof getVehicleFeatures>>,
): { score: number; confidence: number; notes: string } {
  const hasPremiumFeatures =
    featureData.features["premium-audio"]?.available || false;
  const hasComfortFeatures =
    featureData.features["heated-seats"]?.available || false;

  let score = 70;
  const notes = [];

  if (hasPremiumFeatures) {
    score += 15;
    notes.push("Premium features");
  }

  if (hasComfortFeatures) {
    score += 15;
    notes.push("Comfort amenities");
  }

  // Vehicle type considerations
  if (
    vehicle.vehicleSizeClass?.toLowerCase().includes("sedan") ||
    vehicle.vehicleSizeClass?.toLowerCase().includes("luxury")
  ) {
    score += 10;
    notes.push("Professional appearance");
  }

  return {
    score: Math.min(100, score),
    confidence: 0.85,
    notes: notes.join(". "),
  };
}

function analyzeAdventureUse(
  vehicle: any,
  featureData: Awaited<ReturnType<typeof getVehicleFeatures>>,
): { score: number; confidence: number; notes: string } {
  const hasAWD =
    vehicle.drive?.toLowerCase().includes("awd") ||
    vehicle.drive?.toLowerCase().includes("4wd");
  const hasTowingCapability =
    featureData.features["towing"]?.available || false;

  let score = 60;
  const notes = [];

  if (hasAWD) {
    score += 20;
    notes.push("AWD/4WD capability");
  }

  if (hasTowingCapability) {
    score += 20;
    notes.push("Towing capability");
  }

  // Vehicle type considerations
  if (
    vehicle.vehicleSizeClass?.toLowerCase().includes("suv") ||
    vehicle.vehicleSizeClass?.toLowerCase().includes("crossover")
  ) {
    score += 10;
    notes.push("Adventure-ready body style");
  }

  return {
    score: Math.min(100, score),
    confidence: 0.85,
    notes: notes.join(". "),
  };
}
