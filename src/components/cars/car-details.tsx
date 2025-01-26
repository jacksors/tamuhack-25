"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Car,
  Heart,
  Share2,
  ArrowLeft,
  Fuel,
  Gauge,
  Users,
  Calendar,
  DollarSign,
  Star,
  MapPin,
  Clock,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { VehicleScore } from "@/lib/recommendations/types";
import Spinner from "@/components/Spinner";

interface CarDetailsProps {
  car: VehicleScore;
}

export function CarDetails({ car }: CarDetailsProps) {
  const [colorSelected, setColorSelected] = useState(0);
  const router = useRouter();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
        onClick={() => router.back()}
      />
      <motion.div
        layoutId={`car-${car.vehicleId}`}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          className="relative h-[90vh] w-[90vw] max-w-6xl overflow-hidden rounded-lg border bg-background shadow-lg"
        >
          <div className="flex h-full">
            {/* Image Section */}
            <motion.div
              layoutId={`car-image-${car.vehicleId}`}
              className="relative hidden w-1/2 lg:block"
            >
              <Spinner
                colorCodes={car.vehicle.colorCodes ?? ""}
                colorIndex={colorSelected}
                model={car.vehicle.model ?? ""}
                modelTag={car.vehicle.modelTag ?? ""}
                modelGrade={car.vehicle.modelGrade ?? ""}
                imageCountOverride={car.vehicle.imageCount}
                card={false}
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute left-6 top-6 flex items-center gap-3"
              >
                <Badge className="bg-primary px-4 py-2 text-lg text-primary-foreground">
                  {Math.round(car.totalScore)}% Match
                </Badge>
                <Badge
                  variant="outline"
                  className="flex items-center gap-2 bg-background/50 px-4 py-2 text-lg backdrop-blur-sm"
                >
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  Top Pick
                </Badge>
              </motion.div>
            </motion.div>

            {/* Content Section */}
            <div className="flex w-full flex-col lg:w-1/2">
              <div className="flex items-center justify-between border-b p-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.back()}
                  className="shrink-0"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="flex items-center gap-2">
                  <a href={car.vehicle.url} target="_blank" rel="noreferrer">
                    <Button variant="outline" size="icon">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </a>
                </div>
              </div>

              <ScrollArea className="flex-1">
                <div className="space-y-6 p-6">
                  <div className="space-y-2">
                    <motion.h1
                      layoutId={`car-title-${car.vehicleId}`}
                      className="text-2xl font-bold md:text-3xl"
                    >
                      {car.vehicle.year} {car.vehicle.make} {car.vehicle.model}
                    </motion.h1>
                    <motion.div
                      layoutId={`car-price-${car.vehicleId}`}
                      className="text-3xl font-bold text-primary"
                    >
                      {formatCurrency(car.vehicle.msrp || 0)}
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">
                        Fuel Type
                      </div>
                      <div className="flex items-center gap-2">
                        <Fuel className="h-5 w-5 text-primary" />
                        <span className="font-medium">
                          {car.vehicle.fuelType || "Gasoline"}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">
                        Transmission
                      </div>
                      <div className="flex items-center gap-2">
                        <Gauge className="h-5 w-5 text-primary" />
                        <span className="font-medium">
                          {car.vehicle.transmission || "Automatic"}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">
                        Passengers
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        <span className="font-medium">
                          {car.metadata.passengerAnalysis?.actualCapacity || 5}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Year</div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        <span className="font-medium">{car.vehicle.year}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Colors</h2>
                    <div className="flex flex-wrap gap-4">
                      {car.vehicle.colorCodes
                        ?.split(",")
                        .map((color, index) => {
                          const colorHexCodes =
                            car.vehicle.colorHexCodes?.split(","); // Split once
                          const colorHex = colorHexCodes
                            ? colorHexCodes[index]?.trim()
                            : null; // Ensure proper indexing

                          if (!colorHex) return null; // Skip if no hex code is available

                          // Check if the colorHex is a gradient
                          const isGradient = colorHex.startsWith("(");
                          const gradientColors = isGradient
                            ? colorHex
                                .replace("(", "")
                                .replace(")", "")
                                .split(" ")
                                .map((code) => code.trim())
                            : "000000";

                          return isGradient ? (
                            <div
                              key={color + index}
                              className={`h-8 w-8 rounded-full p-2 outline ${colorSelected === index ? "outline" : "outline-[0.5px]"} outline-offset-2 transition-all`}
                              onClick={() => setColorSelected(index)}
                              style={{
                                background: `linear-gradient(-45deg, #${gradientColors[0]} 50%, #${gradientColors[1]} 50%)`,
                              }}
                            ></div>
                          ) : (
                            <div
                              key={color + index}
                              className={`h-8 w-8 rounded-full p-2 outline ${colorSelected === index ? "outline" : "outline-[0.5px]"} outline-offset-2 transition-all`}
                              onClick={() => {
                                setColorSelected(index);
                              }}
                              style={{
                                backgroundColor: `#${colorHex}`,
                              }}
                            />
                          );
                        })}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Key Features</h2>
                    <div className="flex flex-wrap gap-2">
                      {car.metadata.matchingFeatures.map((feature, index) => (
                        <Badge
                          key={feature + index}
                          variant="secondary"
                          className="bg-primary/10"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Match Analysis</h2>
                    <div className="grid gap-4">
                      <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-primary/10 p-2">
                            <DollarSign className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">Price Match</div>
                            <div className="text-sm text-muted-foreground">
                              {car.metadata.priceAnalysis.isWithinBudget
                                ? "Within your budget"
                                : "Slightly above your budget"}
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline">
                          {Math.round(car.factors.priceCompatibility)}%
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-primary/10 p-2">
                            <Car className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">Feature Match</div>
                            <div className="text-sm text-muted-foreground">
                              {car.metadata.matchingFeatures.length} matching
                              features
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline">
                          {Math.round(car.factors.featureAlignment)}%
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-primary/10 p-2">
                            <MapPin className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">Location</div>
                            <div className="text-sm text-muted-foreground">
                              Available nearby
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline">Local Dealer</Badge>
                      </div>

                      <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-primary/10 p-2">
                            <Clock className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">Availability</div>
                            <div className="text-sm text-muted-foreground">
                              Ready for test drive
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline">In Stock</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <div className="border-t p-4">
                <Button className="w-full" size="lg">
                  Schedule Test Drive
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
