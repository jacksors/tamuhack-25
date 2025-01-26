"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Car } from "lucide-react";
import { getOnboardingData } from "@/lib/onboarding-storage";
import { saveUserPreferences } from "@/app/actions/preferences";

export function CallbackHandler() {
  const router = useRouter();
  const [error, setError] = useState<string>();

  useEffect(() => {
    async function savePreferences() {
      try {
        // Get onboarding data from session storage
        const preferences = getOnboardingData();

        if (Object.keys(preferences).length === 0) {
          router.push("/onboarding/welcome");
          return;
        }

        // Validate and provide defaults for required fields
        const validatedPreferences = {
          vehicleTypes: preferences.vehicleTypes || [],
          otherVehicleType: preferences.otherVehicleType,
          usage: preferences.usage || [],
          priorities: preferences.priorities || [],
          features: preferences.features || [],
          fuelPreference: preferences.fuelPreference || "gasoline",
          passengerCount: preferences.passengerCount || 5,
          paymentPlan: {
            type: preferences.paymentPlan?.type || "cash",
            budget: preferences.paymentPlan?.budget,
            monthlyPayment: preferences.paymentPlan?.monthlyPayment,
            creditScore: preferences.paymentPlan?.creditScore,
            downPayment: preferences.paymentPlan?.downPayment,
          },
          location: preferences.location || "",
        };

        // Save preferences to database
        await saveUserPreferences(validatedPreferences);

        // Redirect to dashboard
        router.push("/dashboard");
      } catch (error) {
        console.error("Error saving preferences:", error);
        setError("There was a problem saving your preferences");
      }
    }

    savePreferences();
  }, [router]);

  if (error) {
    return (
      <Card className="w-full max-w-md space-y-4 p-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <Car className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="text-muted-foreground">{error}</p>
        <a
          href="/onboarding/summary"
          className="mt-4 inline-block text-primary hover:underline"
        >
          Return to summary
        </a>
      </Card>
    );
  }

  return null;
}
