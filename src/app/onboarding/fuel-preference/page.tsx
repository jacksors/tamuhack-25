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
import { FuelOption } from "@/components/onboarding/fuel-option";
import {
  saveOnboardingData,
  getOnboardingData,
} from "@/lib/onboarding-storage";

const fuelOptions = [
  {
    value: "gasoline",
    icon: "⛽",
    title: "Gasoline",
    description:
      "Traditional fuel engine with proven reliability and widespread availability",
  },
  {
    value: "diesel",
    icon: "🛢️",
    title: "Diesel",
    description:
      "Better torque and fuel efficiency, ideal for heavy-duty use and long-distance driving",
  },
  {
    value: "hybrid",
    icon: "🔋",
    title: "Hybrid",
    description: "Combination of gas and electric power for optimal efficiency",
  },
  {
    value: "electric",
    icon: "⚡",
    title: "Electric",
    description:
      "Zero-emission vehicle with instant torque and lower operating costs",
  },
  {
    value: "no-preference",
    icon: "🤔",
    title: "No Preference",
    description: "Open to exploring all powertrain options",
  },
];

export default function FuelPreferencePage() {
  const router = useRouter();
  const [selectedFuel, setSelectedFuel] = useState<string>("");

  useEffect(() => {
    const saved = getOnboardingData();
    if (saved.fuelPreference) {
      setSelectedFuel(saved.fuelPreference);
    }
  }, []);

  const handleNext = () => {
    saveOnboardingData({ fuelPreference: selectedFuel });
    router.push("/onboarding/passenger-count");
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <ProgressHeader currentStep={6} totalSteps={10} />

        <Card>
          <CardHeader className="space-y-2 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-2xl font-bold">
                What's Your Fuel Preference?
              </h1>
              <p className="text-muted-foreground">
                Choose your preferred power source
              </p>
            </motion.div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {fuelOptions.map((option, index) => (
                <motion.div
                  key={option.value}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <FuelOption
                    {...option}
                    isSelected={selectedFuel === option.value}
                    onSelect={() => setSelectedFuel(option.value)}
                  />
                </motion.div>
              ))}
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
                disabled={!selectedFuel}
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
