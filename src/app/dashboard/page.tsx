import { Suspense } from "react";
import { getTopCarMatch } from "../actions/cars";
import { HeroCar } from "@/components/dashboard/hero-car";
import { CarGrid } from "@/components/dashboard/car-grid";
import { Car } from "lucide-react";

export default async function DashboardPage() {
  const topMatch = await getTopCarMatch();

  return (
    <main className="min-h-screen pb-20">
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-12">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">
              Your Perfect Match
            </h1>
            <p className="max-w-3xl text-xl text-muted-foreground">
              Based on your preferences, we've found the ideal Toyota that
              matches your lifestyle and requirements
            </p>
          </div>

          <Suspense
            fallback={
              <div className="h-[600px] animate-pulse rounded-lg bg-muted" />
            }
          >
            <HeroCar car={topMatch} matchScore={topMatch.matchScore} />
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
              <CarGrid />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
