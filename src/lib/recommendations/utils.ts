import { ScoreNormalizer, ScoringWeights } from "@/lib/recommendations/types";

export function normalizeScore(
  score: number,
  { min, max }: { min: number; max: number },
): number {
  // More aggressive normalization curve using exponential
  const normalized = Math.pow((score - min) / (max - min), 1.5);
  // Apply weight and ensure score is between 0-1
  return Math.min(Math.max(normalized, 0), 100);
}

export function calculateConfidenceScore(
  factors: Record<string, number>,
): number {
  const scores = Object.values(factors);
  const variance = calculateVariance(scores);
  const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;

  // More aggressive confidence scoring
  const variancePenalty = Math.min(variance / 50, 0.7); // Increased from 0.5
  const meanBonus = Math.pow(mean / 100, 1.2); // Added exponential curve

  return Math.min(Math.max((meanBonus - variancePenalty) * 100, 0), 100);
}

function calculateVariance(numbers: number[]): number {
  const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
  const squareDiffs = numbers.map((num) => Math.pow(num - mean, 2));
  return squareDiffs.reduce((sum, diff) => sum + diff, 0) / numbers.length;
}

export const DEFAULT_WEIGHTS: ScoringWeights = {
  vehicleTypeMatch: 0.2, // 20%
  priceCompatibility: 0.25, // 25%
  featureAlignment: 0.2, // 20%
  passengerFit: 0.1, // 10%
  fuelTypeMatch: 0.15, // 15%
  usageCompatibility: 0.1, // 10%
  locationFactor: 0,
};

export const DEFAULT_NORMALIZER: ScoreNormalizer = {
  min: 0,
  max: 100,
  weight: 1.2, // Increased from 1.0
};

export function calculatePriceCompatibility(
  vehiclePrice: number,
  budget: number,
  monthlyPayment?: number,
): number {
  if (!budget && !monthlyPayment) return 0;

  if (budget) {
    const priceDiff = Math.abs(vehiclePrice - budget);
    const percentDiff = priceDiff / budget;

    // More aggressive scoring curve
    return Math.max(100 - Math.pow(percentDiff * 100, 1.3), 0);
  }

  if (monthlyPayment) {
    const estimatedMonthlyPayment = vehiclePrice * 0.015;
    const paymentDiff = Math.abs(estimatedMonthlyPayment - monthlyPayment);
    const percentDiff = paymentDiff / monthlyPayment;

    return Math.max(100 - Math.pow(percentDiff * 100, 1.3), 0);
  }

  return 0;
}

export function calculateFeatureMatch(
  vehicleFeatures: string[],
  desiredFeatures: string[],
): { score: number; matching: string[]; missing: string[] } {
  if (!desiredFeatures.length) return { score: 0, matching: [], missing: [] };

  const matching = desiredFeatures.filter((feature) =>
    vehicleFeatures.some((vf) =>
      vf.toLowerCase().includes(feature.toLowerCase()),
    ),
  );

  const missing = desiredFeatures.filter(
    (feature) =>
      !vehicleFeatures.some((vf) =>
        vf.toLowerCase().includes(feature.toLowerCase()),
      ),
  );

  // More aggressive scoring curve
  const score = Math.pow(matching.length / desiredFeatures.length, 1.2) * 100;

  return { score, matching, missing };
}
