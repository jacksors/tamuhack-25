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
import { VehicleTypeCard } from "@/components/onboarding/vehicle-type-card";
import { ProgressHeader } from "@/components/onboarding/progress-header";
import {
  saveOnboardingData,
  getOnboardingData,
} from "@/lib/onboarding-storage";
import type { VehicleType } from "@/types/onboarding";

const vehicleOptions: { type: VehicleType; icon: string }[] = [
  { type: "SUV", icon: "🚙" },
  { type: "Sedan", icon: "🚗" },
  { type: "Minivan", icon: "🚐" },
  { type: "Truck", icon: "🛻" },
  { type: "Hybrid/Electric", icon: "⚡" },
  { type: "Sports", icon: "🏎️" },
];

export default function VehicleTypePage() {
  const router = useRouter();
  const [selectedTypes, setSelectedTypes] = useState<VehicleType[]>([]);

  useEffect(() => {
    const saved = getOnboardingData();
    if (saved.vehicleTypes) {
      setSelectedTypes(saved.vehicleTypes);
    }
  }, []);

  const toggleVehicleType = (type: VehicleType) => {
    setSelectedTypes((prev) => {
      const isSelected = prev.includes(type);
      if (isSelected) {
        return prev.filter((t) => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  const handleNext = () => {
    saveOnboardingData({
      vehicleTypes: selectedTypes,
    });
    router.push("/onboarding/vehicle-usage");
  };

  const canProceed = selectedTypes.length > 0;

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <ProgressHeader currentStep={2} totalSteps={10} />

        <Card>
          <CardHeader className="space-y-2 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-2xl font-bold">
                What Kind of Vehicle Are You Looking For?
              </h1>
              <p className="text-muted-foreground">
                Select all types that interest you
              </p>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {vehicleOptions.map((option, index) => (
                <motion.div
                  key={option.type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <VehicleTypeCard
                    type={option.type}
                    icon={option.icon}
                    isSelected={selectedTypes.includes(option.type)}
                    onClick={() => toggleVehicleType(option.type)}
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
                disabled={!canProceed}
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
