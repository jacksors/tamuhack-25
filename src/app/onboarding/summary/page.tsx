"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getOnboardingData } from "@/lib/onboarding-storage";
import {
  Car,
  Sparkles,
  ChevronRight,
  Trophy,
  Zap,
  Users,
  Wallet,
} from "lucide-react";
import type { OnboardingData } from "@/types/onboarding";
import { InsightCard } from "@/components/onboarding/insight-card";
import { PreferenceChart } from "@/components/onboarding/preference-chart";
import { StyleRadar } from "@/components/onboarding/style-radar";
import { authClient } from "@/lib/auth/client";

export default function SummaryPage() {
  const [data, setData] = useState<Partial<OnboardingData>>({});
  const [isSigningIn, setIsSigningIn] = useState(false);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  useEffect(() => {
    const savedData = getOnboardingData();
    setData(savedData);
  }, []);

  // Calculate driving style based on preferences
  const drivingStyle = {
    comfort:
      data.features?.includes("heated-seats") ||
      data.features?.includes("sunroof")
        ? 80
        : 60,
    performance:
      data.features?.includes("sport-mode") ||
      data.features?.includes("paddle-shifters")
        ? 85
        : 55,
    technology:
      data.features?.includes("large-screen") ||
      data.features?.includes("heads-up")
        ? 90
        : 65,
    safety:
      data.features?.includes("safety-package") ||
      data.features?.includes("blind-spot")
        ? 95
        : 70,
    efficiency:
      data.fuelPreference === "hybrid" || data.fuelPreference === "electric"
        ? 90
        : 75,
  };

  const handleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/auth/callback",
      });
    } catch (error) {
      console.error("Error signing in:", error);
      setIsSigningIn(false);
    }
  };

  return (
    <main className="bg-dot-pattern relative min-h-screen">
      <motion.div
        className="fixed inset-x-0 top-0 z-10 h-40 bg-gradient-to-b from-background to-transparent"
        style={{ opacity }}
      />

      <div className="container mx-auto max-w-6xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 space-y-6 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
            }}
            className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10"
          >
            <Trophy className="h-12 w-12 text-primary" />
          </motion.div>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">
              Your Dream Car Analysis
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
              We've analyzed your preferences to create your unique driver
              profile.
              <span className="font-medium text-primary">
                {" "}
                Sign in to see your personalized Toyota matches!
              </span>
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center"
          >
            <Button
              size="lg"
              className="group"
              onClick={handleSignIn}
              disabled={isSigningIn}
            >
              <motion.div
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Sparkles className="h-5 w-5 transition-colors group-hover:text-yellow-400" />
                {isSigningIn ? "Signing in..." : "See Your Matches"}
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            </Button>
          </motion.div>
        </motion.div>

        <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <InsightCard
            icon={Car}
            title="Vehicle Personality"
            value={data.vehicleTypes?.[0] || "Versatile"}
            description="Your primary vehicle preference suggests you value versatility and practicality"
            delay={0.1}
          />
          <InsightCard
            icon={Users}
            title="Passenger Capacity"
            value={`${data.passengerCount || 5} People`}
            description="Perfect for family trips and social occasions"
            delay={0.2}
          />
          <InsightCard
            icon={Wallet}
            title="Investment Approach"
            value={
              data.paymentPlan?.type === "lease" ? "Flexible" : "Long-term"
            }
            description="Your financing choice reflects your ownership goals"
            delay={0.3}
          />
        </div>

        <div className="mb-12 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="space-y-2 text-center">
              <h2 className="text-xl font-semibold">Your Driving Style</h2>
              <p className="text-sm text-muted-foreground">
                Based on your feature preferences
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <StyleRadar data={drivingStyle} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-2 text-center">
              <h2 className="text-xl font-semibold">Priority Distribution</h2>
              <p className="text-sm text-muted-foreground">
                What matters most to you
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <PreferenceChart priorities={data.priorities || []} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="space-y-2 text-center">
            <h2 className="text-xl font-semibold">Usage Insights</h2>
            <p className="text-sm text-muted-foreground">
              How you'll be using your Toyota
            </p>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.usage?.map((usage, index) => (
              <motion.div
                key={usage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-lg bg-muted/50 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">
                      {usage
                        .replace(/-/g, " ")
                        .replace(/(^\w|\s\w)/g, (l) => l.toUpperCase())}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Primary Use Case
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
