"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Heart, Fuel, Gauge } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { VehicleScore } from "@/lib/recommendations/types";
import Spinner from "@/components/Spinner";
import { authClient } from "@/lib/auth/client";
import { useState } from "react";
import type { User } from "@/lib/auth/index";

interface CarCardProps {
  recommendation: VehicleScore;
  detailsAvailable?: false;
}

export function CarCard({ recommendation, detailsAvailable }: CarCardProps) {
  const { vehicle, totalScore, metadata } = recommendation;

  const car = vehicle;
  const router = useRouter();
  const session = authClient.useSession;
  const user = session.get().data?.user as User;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <Card className="group relative overflow-hidden border-2 bg-gradient-to-b from-background to-muted/20 transition-colors hover:border-primary/50">
        <CardContent className="p-0">
          <div className="flex aspect-[4/3] items-center">
            <Spinner
              colorCodes={car.colorCodes ?? ""}
              model={car.model ?? ""}
              modelTag={car.modelTag ?? ""}
              modelGrade={car.modelGrade ?? ""}
              imageIndexOverride={35}
              imageCountOverride={car.imageCount}
              card={true}
            />
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: detailsAvailable === undefined ? 1 : 0 }}
              className="absolute inset-0 z-20 flex items-center justify-center bg-primary/5 opacity-0 backdrop-blur-sm transition-opacity"
            >
              {detailsAvailable === undefined && (
                <Button
                  variant="secondary"
                  className="bg-background/50 backdrop-blur-sm"
                  onClick={() =>
                    router.push(`/cars/${recommendation.vehicleId}`)
                  }
                >
                  View Details
                </Button>
              )}
            </motion.div>

            <Badge className="absolute left-4 top-4 bg-primary text-primary-foreground">
              {Math.round(totalScore)}% Match
            </Badge>
          </div>
          <div className="space-y-4 p-6">
            <div className="space-y-2">
              <h3 className="line-clamp-1 text-lg font-semibold transition-colors group-hover:text-primary">
                {car.year} {car.make} {car.model}
              </h3>
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(car.msrp || 0)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Fuel Type</div>
                <div className="flex items-center gap-1.5">
                  <Fuel className="h-3.5 w-3.5 text-primary" />
                  <span className="text-sm">{car.fuelType || "Gasoline"}</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">
                  Transmission
                </div>
                <div className="flex items-center gap-1.5">
                  <Gauge className="h-3.5 w-3.5 text-primary" />
                  <span className="text-sm">
                    {car.transmission || "Automatic"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge
                variant="secondary"
                className="bg-primary/10 hover:bg-primary/20"
              >
                {car.drive || "FWD"}
              </Badge>
              <Badge
                variant="secondary"
                className="bg-primary/10 hover:bg-primary/20"
              >
                {car.vehicleSizeClass || "Mid-Size"}
              </Badge>
              {metadata.matchingFeatures.slice(0, 3).map((feature) => (
                <Badge
                  key={feature}
                  variant="secondary"
                  className="bg-primary/10 hover:bg-primary/20"
                >
                  {feature == "safety-package" ? "Safety Package" : feature}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
