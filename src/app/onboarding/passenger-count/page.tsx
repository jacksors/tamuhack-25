"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressHeader } from "@/components/onboarding/progress-header";
import { PassengerSelector } from "@/components/onboarding/passenger-selector";
import {
  saveOnboardingData,
  getOnboardingData,
} from "@/lib/onboarding-storage";

export default function PassengerCountPage() {
  const router = useRouter();
  const [passengerCount, setPassengerCount] = useState(5);

  useEffect(() => {
    const saved = getOnboardingData();
    if (saved.passengerCount) {
      setPassengerCount(saved.passengerCount);
    }
  }, []);

  const handleNext = () => {
    saveOnboardingData({ passengerCount });
    router.push("/onboarding/payment-plan");
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <ProgressHeader currentStep={7} totalSteps={10} />

        <Card>
          <CardHeader className="space-y-2 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-2xl font-bold">
                How Many Passengers Do You Need to Accommodate?
              </h1>
              <p className="text-muted-foreground">
                Select the maximum number of passengers (including you)
              </p>
            </motion.div>
          </CardHeader>

          <CardContent>
            <div className="flex justify-center py-8">
              <PassengerSelector
                value={passengerCount}
                onChange={setPassengerCount}
                min={2}
                max={8}
              />
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
              <Button className="sm:flex-1" onClick={handleNext}>
                Next
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </main>
  );
}
