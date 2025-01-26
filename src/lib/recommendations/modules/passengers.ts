import type { ScoringFunction } from "../types";
import { getVehicleFeatures } from "@/lib/vehicle-data/sources/openai";

interface PassengerAnalysis {
  score: number; // 0 to 1
  confidence: number; // 0 to 1
  actualCapacity: number;
  configuration: string;
  notes: string[];
  flexibilityScore: number; // 0 to 1
  comfortScore: number; // 0 to 1
}

export const scorePassengerCapacity: ScoringFunction = async ({
  vehicle,
  preferences,
}) => {
  console.log("\n[Passenger Capacity Scoring]");
  console.log("Desired capacity:", preferences.passengerCount);
  console.log("Vehicle volumes:", {
    twoDoor: vehicle["2DoorPassengerVolume"],
    fourDoor: vehicle["4DoorPassengerVolume"],
    hatchback: vehicle.hatchbackPassengerVolume,
  });

  if (!preferences.passengerCount) {
    return {
      score: 0.5, // Neutral score
      metadata: {
        confidence: 1,
        actualCapacity: 5, // Default capacity
        configuration: "standard",
        notes: ["No passenger capacity preference specified"],
      },
    };
  }

  // Get feature data for third row and seating configuration
  const featureData = await getVehicleFeatures(
    vehicle.year as string,
    vehicle.model as string,
  );
  const hasThirdRow = featureData.features["third-row"]?.available || false;
  const thirdRowConfidence =
    featureData.features["third-row"]?.confidence || 0.7;

  const analysis = analyzePassengerCapacity(
    preferences.passengerCount,
    {
      twoDoorVolume: vehicle["2DoorPassengerVolume"],
      fourDoorVolume: vehicle["4DoorPassengerVolume"],
      hatchbackVolume: vehicle.hatchbackPassengerVolume,
    },
    hasThirdRow,
    thirdRowConfidence,
  );

  console.log("Passenger capacity analysis:", analysis);

  return {
    score: analysis.score,
    metadata: {
      confidence: analysis.confidence,
      actualCapacity: analysis.actualCapacity,
      configuration: analysis.configuration,
      notes: analysis.notes,
      flexibilityScore: analysis.flexibilityScore,
      comfortScore: analysis.comfortScore,
    },
  };
};

interface VehicleVolumes {
  twoDoorVolume?: string | null;
  fourDoorVolume?: string | null;
  hatchbackVolume?: string | null;
}

function analyzePassengerCapacity(
  desiredCount: number,
  volumes: VehicleVolumes,
  hasThirdRow: boolean,
  thirdRowConfidence: number,
): PassengerAnalysis {
  const standardVolumePerPassenger = 55; // cubic feet
  const configurations: Array<{
    type: string;
    volume: number;
    capacity: number;
    comfort: number;
    confidence: number;
  }> = [];

  // Process each available configuration
  if (volumes.twoDoorVolume) {
    const volume = Number(volumes.twoDoorVolume);
    configurations.push({
      type: "2-door",
      volume,
      capacity: Math.round(volume / standardVolumePerPassenger),
      comfort: calculateComfortScore(volume, 2),
      confidence: 0.9,
    });
  }

  if (volumes.fourDoorVolume) {
    const volume = Number(volumes.fourDoorVolume);
    configurations.push({
      type: "4-door",
      volume,
      capacity: Math.round(volume / standardVolumePerPassenger),
      comfort: calculateComfortScore(volume, 4),
      confidence: 0.9,
    });
  }

  if (volumes.hatchbackVolume) {
    const volume = Number(volumes.hatchbackVolume);
    configurations.push({
      type: "hatchback",
      volume,
      capacity: Math.round(volume / standardVolumePerPassenger),
      comfort: calculateComfortScore(volume, 4),
      confidence: 0.9,
    });
  }

  // If no volume data, estimate based on third row
  if (configurations.length === 0) {
    const estimatedCapacity = hasThirdRow ? 7 : 5;
    configurations.push({
      type: "estimated",
      volume: estimatedCapacity * standardVolumePerPassenger,
      capacity: estimatedCapacity,
      comfort: hasThirdRow ? 0.8 : 0.9,
      confidence: thirdRowConfidence,
    });
  }

  // Find best configuration for desired capacity
  const bestConfig = configurations.reduce((best, current) => {
    const currentDiff = Math.abs(current.capacity - desiredCount);
    const bestDiff = Math.abs(best.capacity - desiredCount);
    return currentDiff < bestDiff ? current : best;
  });

  // Calculate base score from capacity match
  const capacityDiff = Math.abs(bestConfig.capacity - desiredCount);
  const baseScore = Math.max(0, 1 - capacityDiff / desiredCount);

  // Calculate flexibility score
  const flexibilityScore = calculateFlexibilityScore(
    configurations,
    desiredCount,
  );

  // Comfort score from best configuration
  const comfortScore = bestConfig.comfort;

  // Apply adjustments
  let finalScore = baseScore;

  // Penalty if capacity is insufficient
  if (bestConfig.capacity < desiredCount) {
    finalScore *= 0.8; // 20% penalty
  }

  // Bonus for flexibility
  finalScore = Math.min(finalScore * (1 + flexibilityScore * 0.2), 1);

  // Comfort adjustment
  finalScore = Math.min(finalScore * (0.8 + comfortScore * 0.2), 1);

  const notes = [
    `${bestConfig.type} configuration with ${bestConfig.capacity} passenger capacity`,
    `Comfort rating: ${Math.round(comfortScore * 100)}%`,
    `Flexibility score: ${Math.round(flexibilityScore * 100)}%`,
  ];

  if (hasThirdRow) {
    notes.push("Includes third row seating");
  }

  return {
    score: finalScore,
    confidence: bestConfig.confidence,
    actualCapacity: bestConfig.capacity,
    configuration: bestConfig.type,
    notes,
    flexibilityScore,
    comfortScore,
  };
}

function calculateComfortScore(volume: number, doors: number): number {
  const baseComfort = Math.min(volume / (55 * doors), 1); // 55 cubic feet per passenger ideal
  const doorBonus = doors === 4 ? 0.1 : 0; // 10% bonus for 4-door configuration
  return Math.min(baseComfort + doorBonus, 1);
}

function calculateFlexibilityScore(
  configurations: Array<{ capacity: number; comfort: number }>,
  desiredCount: number,
): number {
  if (configurations.length === 1) return 0;

  // Calculate how many configurations can handle the desired capacity comfortably
  const viableConfigs = configurations.filter(
    (config) => config.capacity >= desiredCount && config.comfort >= 0.7,
  );

  return Math.min(viableConfigs.length / configurations.length, 1);
}
