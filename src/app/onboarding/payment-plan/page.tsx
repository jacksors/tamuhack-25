"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressHeader } from "@/components/onboarding/progress-header";
import { PaymentOption } from "@/components/onboarding/payment-option";
import { PaymentDetails } from "@/components/onboarding/payment-details";
import {
  saveOnboardingData,
  getOnboardingData,
} from "@/lib/onboarding-storage";
import type { PaymentDetails as IPaymentDetails } from "@/types/payment";

const paymentOptions = [
  {
    value: "cash",
    title: "Full Cash Purchase",
    description: "Pay the full amount upfront for the best deal",
  },
  {
    value: "finance",
    title: "Finance",
    description: "Spread the cost over time with monthly payments",
  },
  {
    value: "lease",
    title: "Lease",
    description: "Lower monthly payments with the option to upgrade later",
  },
];

export default function PaymentPlanPage() {
  const router = useRouter();
  const [paymentType, setPaymentType] = useState("");
  const [paymentDetails, setPaymentDetails] = useState<IPaymentDetails>({
    budget: undefined,
    monthlyPayment: undefined,
    creditScore: undefined,
    downPayment: undefined,
  });

  useEffect(() => {
    const saved = getOnboardingData();
    if (saved.paymentPlan) {
      setPaymentType(saved.paymentPlan.type);
      setPaymentDetails({
        budget: saved.paymentPlan.budget,
        monthlyPayment: saved.paymentPlan.monthlyPayment,
        creditScore: saved.paymentPlan.creditScore,
        downPayment: saved.paymentPlan.downPayment,
      });
    }
  }, []);

  const handleDetailsChange = (key: string, value: any) => {
    setPaymentDetails((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const isValid = () => {
    if (!paymentType) return false;

    if (paymentType === "cash") {
      return !!paymentDetails.budget;
    }

    if (paymentType === "finance") {
      return !!(
        paymentDetails.monthlyPayment &&
        paymentDetails.creditScore &&
        paymentDetails.downPayment
      );
    }

    if (paymentType === "lease") {
      return !!(paymentDetails.monthlyPayment && paymentDetails.creditScore);
    }

    return false;
  };

  const handleNext = () => {
    saveOnboardingData({
      paymentPlan: {
        type: paymentType,
        ...paymentDetails,
      },
    });
    router.push("/onboarding/location");
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <ProgressHeader currentStep={8} totalSteps={10} />

        <Card>
          <CardHeader className="space-y-2 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-2xl font-bold">
                What's Your Preferred Payment Plan?
              </h1>
              <p className="text-muted-foreground">
                Choose how you'd like to finance your Toyota
              </p>
            </motion.div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {paymentOptions.map((option, index) => (
                <motion.div
                  key={option.value}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <PaymentOption
                    {...option}
                    isSelected={paymentType === option.value}
                    onSelect={() => setPaymentType(option.value)}
                  />
                </motion.div>
              ))}

              <AnimatePresence mode="wait">
                {paymentType && (
                  <PaymentDetails
                    type={paymentType}
                    values={paymentDetails}
                    onChange={handleDetailsChange}
                  />
                )}
              </AnimatePresence>
            </div>
          </CardContent>

          <CardFooter>
            <div className="flex w-full flex-col gap-3 sm:flex-row">
              <Button
                variant="outline"
                className="sm:flex-1"
                onClick={() => router.back()}
              >
                Back
              </Button>
              <Button
                className="sm:flex-1"
                onClick={handleNext}
                disabled={!isValid()}
              >
                Next
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </main>
  );
}
