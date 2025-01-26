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
import {
  saveOnboardingData,
  getOnboardingData,
} from "@/lib/onboarding-storage";
import { UsageOption } from "@/components/onboarding/usage-option";

const usageOptions = [
  {
    id: "daily-commuting",
    label: "Daily commuting",
    description: "Regular trips to work or school",
    icon: "🌅",
  },
  {
    id: "road-trips",
    label: "Long road trips",
    description: "Extended journeys and travel",
    icon: "🛣️",
  },
  {
    id: "off-roading",
    label: "Off-roading",
    description: "Adventure on rough terrain",
    icon: "⛰️",
  },
  {
    id: "family",
    label: "Family transportation",
    description: "School runs and family outings",
    icon: "👨‍👩‍👧‍👦",
  },
  {
    id: "business",
    label: "Business purposes",
    description: "Professional use and meetings",
    icon: "💼",
  },
  {
    id: "adventure",
    label: "Adventure/Sports activities",
    description: "Active lifestyle and outdoor sports",
    icon: "🏂",
  },
];

export default function VehicleUsagePage() {
  const router = useRouter();
  const [selectedUsage, setSelectedUsage] = useState<string[]>([]);

  useEffect(() => {
    const saved = getOnboardingData();
    if (saved.usage) {
      setSelectedUsage(saved.usage);
    }
  }, []);

  const toggleUsage = (id: string) => {
    setSelectedUsage((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
  };

  const handleNext = () => {
    saveOnboardingData({ usage: selectedUsage });
    router.push("/onboarding/priorities");
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <ProgressHeader currentStep={3} totalSteps={10} />

        <Card>
          <CardHeader className="space-y-2 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-2xl font-bold">
                How Do You Plan to Use Your Vehicle?
              </h1>
              <p className="text-muted-foreground">
                Select all that apply to your lifestyle
              </p>
            </motion.div>
          </CardHeader>

          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {usageOptions.map((option, index) => (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <UsageOption
                    id={option.id}
                    label={option.label}
                    description={option.description}
                    icon={option.icon}
                    isSelected={selectedUsage.includes(option.id)}
                    onToggle={() => toggleUsage(option.id)}
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
                disabled={selectedUsage.length === 0}
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
