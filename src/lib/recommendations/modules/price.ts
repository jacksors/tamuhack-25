import { type ScoringFunction, ScoringResult } from "../types";

interface PriceAnalysis {
  score: number; // Score between 0 and 1
  isWithinBudget: boolean;
  percentageFromBudget: number;
  estimatedMonthly?: number;
  adjustedPrice?: number;
  creditAdjustment?: number;
  downPaymentImpact?: number;
}

export const scorePriceCompatibility: ScoringFunction = async ({
  vehicle,
  preferences,
}) => {
  console.log("\n[Price Compatibility Scoring]");
  console.log("Vehicle price:", vehicle.msrp);
  console.log("Payment plan:", preferences.paymentPlan);

  if (!vehicle.msrp || !preferences.paymentPlan) {
    return {
      score: 0.5, // Neutral score when no price data
      metadata: {
        isWithinBudget: true,
        percentageFromBudget: 0,
      },
    };
  }

  let analysis: PriceAnalysis;

  if (preferences.paymentPlan.type === "lease") {
    analysis = calculateLeaseScore(
      vehicle.msrp,
      preferences.paymentPlan.monthlyPayment,
      preferences.paymentPlan.creditScore,
      preferences.paymentPlan.downPayment,
    );
  } else if (preferences.paymentPlan.type === "finance") {
    analysis = calculateFinanceScore(
      vehicle.msrp,
      preferences.paymentPlan.monthlyPayment,
      preferences.paymentPlan.creditScore,
      preferences.paymentPlan.downPayment,
    );
  } else {
    // Cash purchase
    analysis = calculateCashScore(
      vehicle.msrp,
      preferences.paymentPlan.budget || 0,
    );
  }

  console.log("Price analysis:", analysis);

  return {
    score: analysis.score,
    metadata: {
      isWithinBudget: analysis.isWithinBudget,
      percentageFromBudget: analysis.percentageFromBudget,
      estimatedMonthly: analysis.estimatedMonthly,
      adjustedPrice: analysis.adjustedPrice,
      creditAdjustment: analysis.creditAdjustment,
      downPaymentImpact: analysis.downPaymentImpact,
    },
  };
};

function calculateLeaseScore(
  vehiclePrice: number,
  monthlyTarget?: number,
  creditScore?: string,
  downPayment = 0,
): PriceAnalysis {
  // Base money factor (equivalent to interest rate / 2400)
  const baseMoneyFactor = 0.00125; // 3% APR equivalent

  // Adjust money factor based on credit score
  const creditAdjustment = calculateCreditAdjustment(creditScore);
  const adjustedMoneyFactor = baseMoneyFactor * creditAdjustment;

  // Residual value (estimated value at lease end)
  const residualPercent = 0.6; // 60% residual value after 3 years
  const residualValue = vehiclePrice * residualPercent;

  // Calculate depreciation
  const depreciation = vehiclePrice - residualValue - downPayment;

  // Monthly depreciation
  const monthlyDepreciation = depreciation / 36; // 36-month lease

  // Monthly finance charge
  const monthlyFinanceCharge =
    (vehiclePrice + residualValue) * adjustedMoneyFactor;

  // Total monthly payment
  const estimatedMonthly = monthlyDepreciation + monthlyFinanceCharge;

  if (!monthlyTarget) {
    return {
      score: 0.5, // Neutral score when no target
      isWithinBudget: true,
      percentageFromBudget: 0,
      estimatedMonthly,
      adjustedPrice: vehiclePrice,
      creditAdjustment,
      downPaymentImpact: downPayment / vehiclePrice,
    };
  }

  const percentageFromTarget =
    (estimatedMonthly - monthlyTarget) / monthlyTarget;
  const isWithinBudget = estimatedMonthly <= monthlyTarget;

  if (!isWithinBudget) {
    return {
      score: 0,
      isWithinBudget: false,
      percentageFromBudget: percentageFromTarget * 100,
      estimatedMonthly,
      adjustedPrice: vehiclePrice,
      creditAdjustment,
      downPaymentImpact: downPayment / vehiclePrice,
    };
  }

  // Calculate base score from payment difference (0 to 1)
  const paymentDifferenceScore = Math.max(
    0,
    1 - Math.abs(percentageFromTarget),
  );

  // Down payment impact (0 to 0.1)
  const downPaymentImpact = downPayment / vehiclePrice;
  const downPaymentBonus = Math.min(downPaymentImpact, 0.1);

  // Final score capped at 1
  const score = Math.min(paymentDifferenceScore + downPaymentBonus, 1);

  return {
    score,
    isWithinBudget: true,
    percentageFromBudget: percentageFromTarget * 100,
    estimatedMonthly,
    adjustedPrice: vehiclePrice,
    creditAdjustment,
    downPaymentImpact,
  };
}

function calculateFinanceScore(
  vehiclePrice: number,
  monthlyTarget?: number,
  creditScore?: string,
  downPayment = 0,
): PriceAnalysis {
  // Base APR
  const baseRate = 0.05; // 5% APR

  // Adjust rate based on credit score
  const creditAdjustment = calculateCreditAdjustment(creditScore);
  const adjustedRate = baseRate * creditAdjustment;

  // Calculate loan amount after down payment
  const loanAmount = vehiclePrice - downPayment;

  // Calculate monthly payment
  const estimatedMonthly = calculateEstimatedMonthlyPayment(
    loanAmount,
    adjustedRate,
    60,
  ); // 60-month term

  if (!monthlyTarget) {
    return {
      score: 0.5,
      isWithinBudget: true,
      percentageFromBudget: 0,
      estimatedMonthly,
      adjustedPrice: loanAmount,
      creditAdjustment,
      downPaymentImpact: downPayment / vehiclePrice,
    };
  }

  const percentageFromTarget =
    (estimatedMonthly - monthlyTarget) / monthlyTarget;
  const isWithinBudget = estimatedMonthly <= monthlyTarget;

  if (!isWithinBudget) {
    return {
      score: 0,
      isWithinBudget: false,
      percentageFromBudget: percentageFromTarget * 100,
      estimatedMonthly,
      adjustedPrice: loanAmount,
      creditAdjustment,
      downPaymentImpact: downPayment / vehiclePrice,
    };
  }

  // Calculate base score from payment difference (0 to 1)
  const paymentDifferenceScore = Math.max(
    0,
    1 - Math.abs(percentageFromTarget),
  );

  // Down payment impact (0 to 0.15)
  const downPaymentImpact = downPayment / vehiclePrice;
  const downPaymentBonus = Math.min(downPaymentImpact * 1.5, 0.15);

  // Credit score impact (0 to 0.1)
  const creditScoreBonus = Math.max(0, (1 - creditAdjustment) / 10);

  // Final score capped at 1
  const score = Math.min(
    paymentDifferenceScore + downPaymentBonus + creditScoreBonus,
    1,
  );

  return {
    score,
    isWithinBudget: true,
    percentageFromBudget: percentageFromTarget * 100,
    estimatedMonthly,
    adjustedPrice: loanAmount,
    creditAdjustment,
    downPaymentImpact,
  };
}

function calculateCashScore(
  vehiclePrice: number,
  budget: number,
): PriceAnalysis {
  const percentageFromBudget = (vehiclePrice - budget) / budget;
  const isWithinBudget = vehiclePrice <= budget;

  if (!isWithinBudget) {
    return {
      score: 0,
      isWithinBudget: false,
      percentageFromBudget: percentageFromBudget * 100,
      adjustedPrice: vehiclePrice,
    };
  }

  // Score based on how close to budget (0 to 1)
  const score = Math.max(0, Math.min(1, 1 - Math.abs(percentageFromBudget)));

  return {
    score,
    isWithinBudget: true,
    percentageFromBudget: percentageFromBudget * 100,
    adjustedPrice: vehiclePrice,
  };
}

function calculateCreditAdjustment(creditScore?: string): number {
  switch (creditScore) {
    case "excellent":
      return 0.8; // 20% reduction in rate
    case "good":
      return 1.0; // Base rate
    case "fair":
      return 1.2; // 20% increase in rate
    case "poor":
      return 1.5; // 50% increase in rate
    default:
      return 1.0; // Default to base rate
  }
}

function calculateEstimatedMonthlyPayment(
  loanAmount: number,
  annualInterestRate: number,
  termMonths: number,
): number {
  const monthlyRate = annualInterestRate / 12;
  const denominator = Math.pow(1 + monthlyRate, termMonths) - 1;
  const payment =
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    denominator;

  return Math.round(payment);
}
