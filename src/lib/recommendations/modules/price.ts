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
  const analysis = calculatePriceScore(
    vehicle.msrp || 0,
    preferences.paymentPlan?.budget,
    preferences.paymentPlan?.monthlyPayment,
    preferences.paymentPlan?.type,
  );

  return {
    score: normalizeScore(analysis.score, {
      ...normalizer,
      weight: weights.price,
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

    // Score calculation for cash purchase
    let score = 100 - Math.abs(percentageFromBudget);

    // Penalty for being over budget
    if (!isWithinBudget) {
      score *= 0.8; // 20% penalty for being over budget
    }

    // Bonus for being under budget but not too much under
    if (isWithinBudget && percentageFromBudget > -20) {
      score *= 1.1; // 10% bonus for being slightly under budget
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      isWithinBudget,
      percentageFromBudget,
    };
  }

  // Handle financing/lease
  if ((paymentType === "finance" || paymentType === "lease") && monthlyTarget) {
    // Estimated monthly payment calculation
    // Using a simplified calculation - in reality, this would use more complex formulas
    // considering interest rates, lease residual values, etc.
    const interestRate = paymentType === "finance" ? 0.05 : 0.03; // Example rates
    const term = paymentType === "finance" ? 60 : 36; // 5 years for finance, 3 for lease

    const estimatedMonthly = calculateEstimatedMonthlyPayment(
      vehiclePrice,
      interestRate,
      term,
    );
    const percentageFromTarget =
      ((estimatedMonthly - monthlyTarget) / monthlyTarget) * 100;
    const isWithinBudget = estimatedMonthly <= monthlyTarget;

    // Score calculation for monthly payments
    let score = 100 - Math.abs(percentageFromTarget);

    // Penalty for being over monthly target
    if (!isWithinBudget) {
      score *= 0.8;
    }

    // Bonus for being under monthly target but not too much under
    if (isWithinBudget && percentageFromTarget > -20) {
      score *= 1.1;
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      isWithinBudget,
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
