import { type ScoringFunction, ScoringResult } from "../types";
import { normalizeScore } from "../utils";

interface PriceAnalysis {
  score: number;
  isWithinBudget: boolean;
  percentageFromBudget: number;
  estimatedMonthly?: number;
}

export const scorePriceCompatibility: ScoringFunction = async ({
  vehicle,
  preferences,
  weights,
  normalizer,
}) => {
  console.log("\n[Price Compatibility Scoring]");
  console.log("Vehicle price:", vehicle.msrp);
  console.log("Budget:", preferences.paymentPlan?.budget);
  console.log("Monthly target:", preferences.paymentPlan?.monthlyPayment);
  const analysis = calculatePriceScore(
    vehicle.msrp || 0,
    preferences.paymentPlan?.budget,
    preferences.paymentPlan?.monthlyPayment,
    preferences.paymentPlan?.type,
  );

  return {
    score: normalizeScore(analysis.score, {
      ...normalizer,
      weight: weights.priceCompatibility,
    }),
    metadata: {
      isWithinBudget: analysis.isWithinBudget,
      percentageFromBudget: analysis.percentageFromBudget,
    },
  };
};

function calculatePriceScore(
  vehiclePrice: number,
  budget?: number,
  monthlyTarget?: number,
  paymentType?: string,
): PriceAnalysis {
  // If no budget or monthly payment target, return neutral score
  if (!budget && !monthlyTarget) {
    return {
      score: 50, // Neutral score when no price preferences
      isWithinBudget: true,
      percentageFromBudget: 0,
    };
  }

  // Handle cash purchase
  if (paymentType === "cash" && budget) {
    const percentageFromBudget = ((vehiclePrice - budget) / budget) * 100;
    const isWithinBudget = vehiclePrice <= budget;

    // If over budget, return 0
    if (!isWithinBudget) {
      return {
        score: 0,
        isWithinBudget: false,
        percentageFromBudget,
      };
    }

    // Linear penalty for being under budget
    // Score decreases as the price gets further under budget
    // Example: If price is 20% under budget, score would be 80
    const score = 100 - Math.abs(percentageFromBudget);

    return {
      score: Math.max(0, score),
      isWithinBudget: true,
      percentageFromBudget,
    };
  }

  // Handle financing/lease
  if ((paymentType === "finance" || paymentType === "lease") && monthlyTarget) {
    const interestRate = paymentType === "finance" ? 0.05 : 0.03;
    const term = paymentType === "finance" ? 60 : 36;

    const estimatedMonthly = calculateEstimatedMonthlyPayment(
      vehiclePrice,
      interestRate,
      term,
    );
    const percentageFromTarget =
      ((estimatedMonthly - monthlyTarget) / monthlyTarget) * 100;
    const isWithinBudget = estimatedMonthly <= monthlyTarget;

    // If over monthly target, return 0
    if (!isWithinBudget) {
      return {
        score: 0,
        isWithinBudget: false,
        percentageFromBudget: percentageFromTarget,
        estimatedMonthly,
      };
    }

    // Linear penalty for being under monthly target
    const score = 100 - Math.abs(percentageFromTarget);

    return {
      score: Math.max(0, score),
      isWithinBudget: true,
      percentageFromBudget: percentageFromTarget,
      estimatedMonthly,
    };
  }

  // Default case
  return {
    score: 50,
    isWithinBudget: true,
    percentageFromBudget: 0,
  };
}

function calculateEstimatedMonthlyPayment(
  vehiclePrice: number,
  annualInterestRate: number,
  termMonths: number,
): number {
  const monthlyRate = annualInterestRate / 12;
  const denominator = Math.pow(1 + monthlyRate, termMonths) - 1;
  const payment =
    (vehiclePrice * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    denominator;

  return Math.round(payment);
}
