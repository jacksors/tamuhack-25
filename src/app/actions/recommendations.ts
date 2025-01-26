"use server";

import { RecommendationEngine } from "@/lib/recommendations/engine";
import { getUserPreferences } from "./preferences";
import { getAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { UserPreferences } from "@/lib/recommendations/types";

export async function getRecommendations(limit?: number) {
  const auth = await getAuth();
  if (!auth?.user) {
    redirect("/onboarding/welcome");
  }

  const rawPreferences = await getUserPreferences();
  if (!rawPreferences) {
    redirect("/onboarding/welcome");
  }

  // Transform nullable preferences into required format
  const preferences: UserPreferences = {
    vehicleTypes: rawPreferences.vehicleTypes || [],
    otherVehicleType: rawPreferences.otherVehicleType || undefined,
    usage: rawPreferences.usage || [],
    priorities: rawPreferences.priorities || [],
    features: rawPreferences.features || [],
    fuelPreference: rawPreferences.fuelPreference || undefined,
    passengerCount: rawPreferences.passengerCount || undefined,
    paymentPlan: rawPreferences.paymentPlan || undefined,
    location: rawPreferences.location || undefined,
  };

  const engine = new RecommendationEngine();
  return engine.getRecommendations(preferences, limit);
}
