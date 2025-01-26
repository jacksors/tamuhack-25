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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import { ProgressHeader } from "@/components/onboarding/progress-header";
import {
  saveOnboardingData,
  getOnboardingData,
} from "@/lib/onboarding-storage";

export default function LocationPage() {
  const router = useRouter();
  const [zipCode, setZipCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = getOnboardingData();
    if (saved.location) {
      setZipCode(saved.location);
    }
  }, []);

  const validateZipCode = (zip: string) => {
    const zipRegex = /^\d{5}$/;
    return zipRegex.test(zip);
  };

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, 5);
    setZipCode(value);
    if (value.length === 5 && !validateZipCode(value)) {
      setError("Please enter a valid ZIP code");
    } else {
      setError("");
    }
  };

  const handleNext = () => {
    if (validateZipCode(zipCode)) {
      saveOnboardingData({ location: zipCode });
      router.push("/onboarding/summary");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <ProgressHeader currentStep={9} totalSteps={10} />

        <Card>
          <CardHeader className="space-y-2 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-2xl font-bold">What's Your ZIP Code?</h1>
              <p className="text-muted-foreground">
                Help us find Toyota dealers and inventory in your area
              </p>
            </motion.div>
          </CardHeader>

          <CardContent>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-8"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <MapPin className="h-10 w-10 text-primary" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">Enter your ZIP code</Label>
                <Input
                  id="zipCode"
                  value={zipCode}
                  onChange={handleZipChange}
                  placeholder="e.g., 12345"
                  className="w-full text-center text-2xl tracking-widest"
                  maxLength={5}
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-sm text-destructive"
                  >
                    {error}
                  </motion.p>
                )}
              </div>
            </motion.div>
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
                disabled={!validateZipCode(zipCode)}
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
