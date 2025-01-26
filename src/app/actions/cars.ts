"use server";

import { desc, eq } from "drizzle-orm";
import db from "@/server/db";
import { vehiclesTable } from "@/server/db/schema";
import { getUserPreferences } from "./preferences";

export async function getTopCarMatch() {
  const preferences = await getUserPreferences();

  // For now, return a default car until recommendation engine is implemented
  const topMatch = await db
    .select()
    .from(vehiclesTable)
    .orderBy(desc(vehiclesTable.msrp))
    .then((rows) => rows[0]);

  return {
    ...topMatch,
    matchScore: 98, // Placeholder until we implement the matching algorithm
  };
}

export async function getMoreCars({
  offset = 0,
  limit = 12,
}: {
  offset?: number;
  limit?: number;
}) {
  const cars = await db
    .select()
    .from(vehiclesTable)
    .orderBy(desc(vehiclesTable.msrp))
    .limit(limit)
    .offset(offset);

  return cars;
}
