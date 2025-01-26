import { Suspense } from "react";
import { getRecommendations } from "../actions/recommendations";
import { HeroCar } from "@/components/dashboard/hero-car";
import { CarGrid } from "@/components/dashboard/car-grid";
import { Car } from "lucide-react";
import { VehicleScore } from "@/lib/recommendations/types";

export default async function DashboardPage() {
  // Get top 10 recommendations
  const recommendations = await getRecommendations(10);
  const topMatch = recommendations;

  if (!recommendations.length) {
    throw new Error("No recommendations found");
  }

  return (
    <main className="min-h-screen pb-20">
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-12">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">
              Your Perfect Toyota Match
            </h1>
            <p className="max-w-3xl text-xl text-muted-foreground">
              Based on your preferences, we've found these ideal Toyota models
              that match your lifestyle and requirements
            </p>
          </div>

          <Suspense
            fallback={
              <div className="h-[600px] animate-pulse rounded-lg bg-muted" />
            }
          >
            <HeroCar recommendation={topMatch[0] as VehicleScore} />
          </Suspense>

          <div className="space-y-8">
            <div className="flex items-end justify-between border-b pb-4">
              <div className="space-y-1">
                <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
                  <Car className="h-6 w-6 text-primary" />
                  More Matches
                </h2>
                <p className="text-lg text-muted-foreground">
                  Discover other Toyota models that align with your preferences
                </p>
              </div>
            </div>

            <Suspense
              fallback={
                <div className="h-[400px] animate-pulse rounded-lg bg-muted" />
              }
            >
              <CarGrid initialRecommendations={recommendations.slice(1)} />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
