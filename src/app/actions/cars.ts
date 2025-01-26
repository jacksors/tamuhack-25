"use server"

import { getRecommendations } from "./recommendations"
import db from "@/server/db";
import { sql } from "drizzle-orm";
import { vehiclesTable } from "@/server/db/schema";

export async function getCarDetails(id: string) {
  const recommendations = await getRecommendations(50) // Get a larger pool
  return recommendations.find((rec) => rec.vehicleId === id)
}

export async function getRandomCar(num: number) {
  try {
    const rows = await db
      .select()
      .from(vehiclesTable)
      .orderBy(sql.raw("RANDOM()"))
      .limit(num);

    if (rows.length === 0) {
      throw new Error("No cars found in the database.");
    }
    return num === 1 ? rows[0] : rows;
  } catch (error : any) {
    console.error("Error fetching random car:", error.message);
    throw new Error("Failed to fetch random car(s). Please try again later.");
  }
}

