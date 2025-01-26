"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Share2,
  Car,
  Fuel,
  Users,
  Gauge,
  ArrowRight,
  Star,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import Spinner from "@/components/Spinner";

interface HeroCarProps {
  car: any;
  matchScore: number;
}

export function HeroCar({ car, matchScore }: HeroCarProps) {
  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="via-primary/2 overflow-hidden border-2 bg-gradient-to-br from-primary/5 to-background">
          <CardContent className="p-0">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="group relative aspect-[4/3] lg:aspect-auto">
                <div className="bg-dot-pattern absolute inset-0 opacity-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                <Spinner
                  colorCodes={car.colorCodes}
                  model={car.model}
                  modelTag={car.modelTag}
                  modelGrade={car.modelGrade}
                  imageIndexOverride={35}
                  imageCountOverride={car.imageCount}
                />

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="absolute left-6 top-6 flex items-center gap-3"
                >
                  <Badge
                    className="bg-primary px-4 py-2 text-lg text-primary-foreground"
                    variant="secondary"
                  >
                    Top Match
                  </Badge>
                  <Badge
                    className="flex items-center gap-2 bg-background/50 px-4 py-2 text-lg backdrop-blur-sm"
                    variant="outline"
                  >
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    {matchScore}% Match
                  </Badge>
                </motion.div>
              </div>

              <div className="space-y-8 p-8">
                <div className="space-y-3">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-bold md:text-3xl lg:text-4xl"
                  >
                    {car.year} {car.make} {car.model}
                  </motion.h1>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl font-bold text-primary"
                  >
                    {formatCurrency(car.msrp || 0)}
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="grid grid-cols-2 gap-6"
                >
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Fuel Type
                    </div>
                    <div className="flex items-center gap-2">
                      <Fuel className="h-5 w-5 text-primary" />
                      <span className="font-medium">
                        {car.fuelType || "Gasoline"}
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
                        {car.transmission || "Automatic"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Drive</div>
                    <div className="flex items-center gap-2">
                      <Car className="h-5 w-5 text-primary" />
                      <span className="font-medium">{car.drive || "FWD"}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Size Class
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      <span className="font-medium">
                        {car.vehicleSizeClass || "Mid-Size"}
                      </span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex gap-4 pt-4"
                >
                  <Button className="group flex-1" size="lg">
                    Schedule Test Drive
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-12 w-12">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-12 w-12">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}