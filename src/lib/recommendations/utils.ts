import { ScoreNormalizer, ScoringWeights } from "@/lib/recommendations/types";

export function normalizeScore(
  score: number,
  { min, max, weight }: { min: number; max: number; weight: number },
): number {
  // Normalize to 0-1 range
  const normalized = (score - min) / (max - min);
  // Apply weight and ensure score is between 0-100
  return Math.min(Math.max(normalized * weight * 100, 0), 100);
}

export function calculateConfidenceScore(
  factors: Record<string, number>,
): number {
  const scores = Object.values(factors);
  const variance = calculateVariance(scores);
  const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;

  // Higher variance = lower confidence
  const variancePenalty = Math.min(variance / 100, 0.5);
  // Higher mean = higher confidence
  const meanBonus = mean / 100;

  return Math.min(Math.max((meanBonus - variancePenalty) * 100, 0), 100);
}

function calculateVariance(numbers: number[]): number {
  const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
  const squareDiffs = numbers.map((num) => Math.pow(num - mean, 2));
  return squareDiffs.reduce((sum, diff) => sum + diff, 0) / numbers.length;
}

export function calculatePriceCompatibility(
  vehiclePrice: number,
  budget: number,
  monthlyPayment?: number,
): number {
  if (!budget && !monthlyPayment) return 0;

  if (budget) {
    const priceDiff = Math.abs(vehiclePrice - budget);
    const percentDiff = priceDiff / budget;

    // Score decreases as price difference increases
    return Math.max(100 - percentDiff * 100, 0);
  }

  if (monthlyPayment) {
    // Rough estimation: Monthly payment is approximately 1.5% of vehicle price
    // (This is a simplification - real calculations would consider interest rate, term length, etc.)
    const estimatedMonthlyPayment = vehiclePrice * 0.015;
    const paymentDiff = Math.abs(estimatedMonthlyPayment - monthlyPayment);
    const percentDiff = paymentDiff / monthlyPayment;

    return Math.max(100 - percentDiff * 100, 0);
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

  const score = (matching.length / desiredFeatures.length) * 100;

  return { score, matching, missing };
}

export const DEFAULT_WEIGHTS: ScoringWeights = {
  vehicleTypeMatch: 1.0,
  priceCompatibility: 0.9,
  featureAlignment: 0.8,
  passengerFit: 0.7,
  fuelTypeMatch: 0.7,
  usageCompatibility: 0.6,
  locationFactor: 0,
};

export const DEFAULT_NORMALIZER: ScoreNormalizer = {
  min: 0,
  max: 100,
  weight: 1.0,
};
