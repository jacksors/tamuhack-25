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
import { FeatureGroup } from "@/components/onboarding/feature-group";
import {
  saveOnboardingData,
  getOnboardingData,
} from "@/lib/onboarding-storage";

const featureGroups = [
  {
    title: "Safety & Assistance",
    features: [
      { id: "awd", label: "All-wheel drive (AWD)", icon: "🚙" },
      { id: "safety-package", label: "Advanced safety package", icon: "🛡️" },
      { id: "lane-assist", label: "Lane departure assist", icon: "🛣️" },
      { id: "blind-spot", label: "Blind-spot monitoring", icon: "👁️" },
    ],
  },
  {
    title: "Comfort & Convenience",
    features: [
      { id: "sunroof", label: "Sunroof/Moonroof", icon: "☀️" },
      { id: "heated-seats", label: "Heated seats", icon: "🔥" },
      { id: "third-row", label: "Third-row seating", icon: "💺" },
      { id: "wireless-charging", label: "Wireless charging", icon: "🔋" },
    ],
  },
  {
    title: "Technology & Entertainment",
    features: [
      { id: "large-screen", label: "Large touchscreen", icon: "📱" },
      { id: "premium-audio", label: "Premium audio system", icon: "🔊" },
      { id: "smartphone", label: "Smartphone integration", icon: "📲" },
      { id: "heads-up", label: "Heads-up display", icon: "📽️" },
    ],
  },
  {
    title: "Performance & Capability",
    features: [
      { id: "towing", label: "Towing capacity", icon: "🔄" },
      { id: "sport-mode", label: "Sport driving mode", icon: "🏎️" },
      { id: "adaptive-suspension", label: "Adaptive suspension", icon: "🔧" },
      { id: "paddle-shifters", label: "Paddle shifters", icon: "🎮" },
    ],
  },
];

export default function FeaturesPage() {
  const router = useRouter();
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  useEffect(() => {
    const saved = getOnboardingData();
    if (saved.features) {
      setSelectedFeatures(saved.features);
    }
  }, []);

  const toggleFeature = (id: string) => {
    setSelectedFeatures((prev) => {
      if (prev.includes(id)) {
        return prev.filter((f) => f !== id);
      }
      return [...prev, id];
    });
  };

  const handleNext = () => {
    saveOnboardingData({ features: selectedFeatures });
    router.push("/onboarding/fuel-preference");
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl"
      >
        <ProgressHeader currentStep={5} totalSteps={10} />

        <Card>
          <CardHeader className="space-y-2 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-2xl font-bold">
                What Features Matter Most to You?
              </h1>
              <p className="text-muted-foreground">
                Select the features you'd like in your Toyota
              </p>
            </motion.div>
          </CardHeader>

          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {featureGroups.map((group, index) => (
                <FeatureGroup
                  key={group.title}
                  title={group.title}
                  features={group.features}
                  selectedFeatures={selectedFeatures}
                  onToggleFeature={toggleFeature}
                  delay={index * 0.1 + 0.3}
                />
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
                disabled={selectedFeatures.length === 0}
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
