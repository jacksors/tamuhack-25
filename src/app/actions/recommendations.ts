"use server";

import { RecommendationEngine } from "@/lib/recommendations/engine";
import { getUserPreferences } from "./preferences";
import { getAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { nanoid } from "nanoid";
import { and, eq } from "drizzle-orm";
import db from "@/server/db";
import { recommendationsCacheTable } from "@/server/db/schema";
import { hashPreferences } from "@/server/utils";
import type {
  UserPreferences,
  VehicleScore,
} from "@/lib/recommendations/types";
import { nullableToOptional } from "@/lib/utils";

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export async function getRecommendations() {
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
    paymentPlan: nullableToOptional(rawPreferences.paymentPlan) || undefined,
    location: rawPreferences.location || undefined,
  };

  // Generate a hash of the preferences
  const preferencesHash = hashPreferences(preferences);

  // Check cache
  const cachedRecommendations = await db
    .select()
    .from(recommendationsCacheTable)
    .where(
      and(
        eq(recommendationsCacheTable.userId, auth.user.id),
        eq(recommendationsCacheTable.preferencesHash, preferencesHash),
      ),
    )
    .then((rows) => rows[0]);

  // If we have valid cache, use it
  if (cachedRecommendations) {
    const cacheAge = Date.now() - cachedRecommendations.lastUpdated.getTime();
    if (cacheAge < CACHE_TTL) {
      const recommendations =
        cachedRecommendations.recommendations as VehicleScore[];
      return recommendations;
    }
  }

  // If no cache or expired, generate new recommendations
  const engine = new RecommendationEngine();
  const recommendations = await engine.getRecommendations(preferences); // Get 50 recommendations to cache

  // Delete any existing cache entries for this user and preferences hash
  await db
    .delete(recommendationsCacheTable)
    .where(
      and(
        eq(recommendationsCacheTable.userId, auth.user.id),
        eq(recommendationsCacheTable.preferencesHash, preferencesHash),
      ),
    );

  // Insert new cache entry
  await db.insert(recommendationsCacheTable).values({
    id: nanoid(),
    userId: auth.user.id,
    recommendations,
    preferencesHash,
    lastUpdated: new Date(),
  });
  return recommendations;
}

// Add this function to invalidate cache when needed
export async function invalidateRecommendationsCache(userId: string) {
  await db
    .delete(recommendationsCacheTable)
    .where(eq(recommendationsCacheTable.userId, userId));
}
