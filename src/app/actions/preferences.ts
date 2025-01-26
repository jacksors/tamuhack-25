"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import db from "@/server/db";
import { userPreferencesTable } from "@/server/db/schema";
import { nanoid } from "nanoid";
import { getAuth } from "@/lib/auth";
import { invalidateRecommendationsCache } from "./recommendations";

const preferencesSchema = z.object({
  vehicleTypes: z.array(z.string()),
  otherVehicleType: z.string().optional(),
  usage: z.array(z.string()),
  priorities: z.array(z.string()),
  features: z.array(z.string()),
  fuelPreference: z.string(),
  passengerCount: z.number(),
  paymentPlan: z.object({
    type: z.string(),
    budget: z.number().optional(),
    monthlyPayment: z.number().optional(),
    creditScore: z.string().optional(),
    downPayment: z.number().optional(),
  }),
  location: z.string(),
});

export async function saveUserPreferences(
  preferences: z.infer<typeof preferencesSchema>,
) {
  const auth = await getAuth();
  if (!auth?.user?.id) {
    throw new Error("Not authenticated");
  }

  const validated = preferencesSchema.parse(preferences);

  // Check if user already has preferences
  const existing = await db
    .select()
    .from(userPreferencesTable)
    .where(eq(userPreferencesTable.userId, auth.user.id))
    .then((rows) => rows[0]);

  if (existing) {
    // Update existing preferences
    await db
      .update(userPreferencesTable)
      .set({
        vehicleTypes: validated.vehicleTypes,
        otherVehicleType: validated.otherVehicleType,
        usage: validated.usage,
        priorities: validated.priorities,
        features: validated.features,
        fuelPreference: validated.fuelPreference,
        passengerCount: validated.passengerCount,
        paymentPlan: validated.paymentPlan.type,
        paymentBudget: validated.paymentPlan.budget,
        paymentMonthly: validated.paymentPlan.monthlyPayment,
        creditScore: validated.paymentPlan.creditScore,
        paymentDownPayment: validated.paymentPlan.downPayment,
        location: validated.location,
        updatedAt: new Date(),
      })
      .where(eq(userPreferencesTable.id, existing.id));
  } else {
    // Create new preferences
    await db.insert(userPreferencesTable).values({
      id: nanoid(),
      userId: auth.user.id,
      vehicleTypes: validated.vehicleTypes,
      otherVehicleType: validated.otherVehicleType,
      usage: validated.usage,
      priorities: validated.priorities,
      features: validated.features,
      fuelPreference: validated.fuelPreference,
      passengerCount: validated.passengerCount,
      paymentPlan: validated.paymentPlan.type,
      paymentBudget: validated.paymentPlan.budget,
      paymentMonthly: validated.paymentPlan.monthlyPayment,
      creditScore: validated.paymentPlan.creditScore,
      paymentDownPayment: validated.paymentPlan.downPayment,
      location: validated.location,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // Invalidate recommendations cache when preferences change
  await invalidateRecommendationsCache(auth.user.id);

  return { success: true };
}

export async function getUserPreferences() {
  const auth = await getAuth();
  if (!auth?.user?.id) {
    return null;
  }

  const preferences = await db
    .select()
    .from(userPreferencesTable)
    .where(eq(userPreferencesTable.userId, auth.user.id))
    .then((rows) => rows[0]);

  if (!preferences) {
    return null;
  }

  return {
    vehicleTypes: preferences.vehicleTypes,
    otherVehicleType: preferences.otherVehicleType,
    usage: preferences.usage,
    priorities: preferences.priorities,
    features: preferences.features,
    fuelPreference: preferences.fuelPreference,
    passengerCount: preferences.passengerCount,
    paymentPlan: {
      type: preferences.paymentPlan,
      budget: preferences.paymentBudget,
      monthlyPayment: preferences.paymentMonthly,
      creditScore: preferences.creditScore,
      downPayment: preferences.paymentDownPayment,
    },
    location: preferences.location,
  };
}
