import type { ScoringFunction } from "../types";
import { normalizeScore } from "../utils";
import { getVehicleFeatures } from "@/lib/vehicle-data/sources/openai";

interface PassengerAnalysis {
  score: number;
  confidence: number;
  actualCapacity: number;
  configuration: string;
  passengerNotes: string;
}

export const scorePassengerCapacity: ScoringFunction = async ({
  vehicle,
  preferences,
  weights,
  normalizer,
}) => {
  if (!preferences.passengerCount) {
    return {
      score: normalizeScore(50, { ...normalizer, weight: weights.passengers }),
      metadata: {
        confidence: 1,
      },
    };
  }

  // Get feature data from OpenAI, including third row information
  const featureData = await getVehicleFeatures(
    vehicle.year as string,
    vehicle.model as string,
  );
  const hasThirdRow = featureData.features["third-row"]?.available || false;
  const thirdRowConfidence =
    featureData.features["third-row"]?.confidence || 0.7;

  const analysis = calculatePassengerScore(
    preferences.passengerCount,
    vehicle["2DoorPassengerVolume"],
    vehicle["4DoorPassengerVolume"],
    vehicle.hatchbackPassengerVolume,
    hasThirdRow,
    thirdRowConfidence,
  );

  return {
    score: normalizeScore(analysis.score, {
      ...normalizer,
      weight: weights.passengers,
    }),
    metadata: {
      confidence: analysis.confidence,
      actualCapacity: analysis.actualCapacity,
      configuration: analysis.configuration,
      passengerNotes: analysis.passengerNotes,
    },
  };
};

function calculatePassengerScore(
  desiredCount: number,
  twoDoorVolume?: string,
  fourDoorVolume?: string,
  hatchbackVolume?: string,
  hasThirdRow?: boolean,
  thirdRowConfidence = 0.7,
): PassengerAnalysis {
  // Convert passenger volumes to estimated capacities
  // Industry standard: ~55 cubic feet per passenger for comfort
  const standardVolumePerPassenger = 55;

  const configurations: Array<{
    type: string;
    volume: number;
    estimatedCapacity: number;
    confidence: number;
  }> = [];

  // Process each available configuration
  if (twoDoorVolume) {
    configurations.push({
      type: "2-door",
      volume: Number.parseFloat(twoDoorVolume),
      estimatedCapacity: Math.round(
        Number.parseFloat(twoDoorVolume) / standardVolumePerPassenger,
      ),
      confidence: 0.9,
    });
  }

  if (fourDoorVolume) {
    configurations.push({
      type: "4-door",
      volume: Number.parseFloat(fourDoorVolume),
      estimatedCapacity: Math.round(
        Number.parseFloat(fourDoorVolume) / standardVolumePerPassenger,
      ),
      confidence: 0.9,
    });
  }

  if (hatchbackVolume) {
    configurations.push({
      type: "hatchback",
      volume: Number.parseFloat(hatchbackVolume),
      estimatedCapacity: Math.round(
        Number.parseFloat(hatchbackVolume) / standardVolumePerPassenger,
      ),
      confidence: 0.9,
    });
  }

  // If no volume data available, use basic estimation based on vehicle class and third row info
  if (configurations.length === 0) {
    let defaultCapacity = 5; // Base capacity for most vehicles
    let confidence = 0.7; // Base confidence for estimated capacity

    if (hasThirdRow) {
      defaultCapacity = 7; // Increase capacity for third row vehicles
      confidence = thirdRowConfidence; // Use the confidence from OpenAI's feature detection
    }

    configurations.push({
      type: "estimated",
      volume: defaultCapacity * standardVolumePerPassenger,
      estimatedCapacity: defaultCapacity,
      confidence,
    });
  }

  // Find the best matching configuration
  const bestConfig = configurations.reduce(
    (best, current) => {
      const currentDiff = Math.abs(current.estimatedCapacity - desiredCount);
      const bestDiff = Math.abs(best.estimatedCapacity - desiredCount);
      return currentDiff < bestDiff ? current : best;
    },
    configurations[0] as (typeof configurations)[0],
  );

  // Calculate score based on how well the best configuration matches
  const capacityDiff = Math.abs(bestConfig.estimatedCapacity - desiredCount);
  let score = 100 - capacityDiff * 20; // -20 points per passenger difference

  // Bonus for exact match
  if (capacityDiff === 0) {
    score *= 1.2; // 20% bonus
  }

  // Penalty if best capacity is less than desired
  if (bestConfig.estimatedCapacity < desiredCount) {
    score *= 0.8; // 20% penalty for being too small
  }

  // Generate explanatory notes
  const passengerNotes = `${bestConfig.type} configuration with estimated capacity of ${
    bestConfig.estimatedCapacity
  } passengers${hasThirdRow ? " (includes third row seating)" : ""}`;

  return {
    score: Math.max(0, Math.min(100, score)),
    confidence: bestConfig.confidence,
    actualCapacity: bestConfig.estimatedCapacity,
    configuration: bestConfig.type,
    passengerNotes,
  };
}
