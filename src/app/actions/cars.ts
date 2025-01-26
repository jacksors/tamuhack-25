"use server";

import { getRecommendations } from "./recommendations";

export async function getCarDetails(id: string) {
  const recommendations = await getRecommendations(); // Get a larger pool
  return recommendations.find((rec) => rec.vehicleId === id);
}
