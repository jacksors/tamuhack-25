"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock } from "lucide-react";

interface PreviewCardProps {
  car: {
    name: string;
    match: number;
    features: string[];
    image: string;
  };
  delay?: number;
}

export function PreviewCard({ car, delay = 0 }: PreviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -5 }}
      className="group relative"
    >
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative aspect-video">
            <motion.div
              className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.5 }}
            >
              <div className="p-4 text-center">
                <Lock className="mx-auto mb-2 h-8 w-8 text-primary" />
                <p className="text-sm font-medium">Sign in to unlock</p>
              </div>
            </motion.div>
            <img
              src={car.image || "/placeholder.svg"}
              alt={car.name}
              className="h-full w-full object-cover blur-sm filter transition-all duration-300 group-hover:blur-none"
            />
            <Badge
              className="absolute right-4 top-4 bg-primary text-primary-foreground"
              variant="secondary"
            >
              {car.match}% Match
            </Badge>
          </div>
          <div className="p-4">
            <h3 className="mb-2 font-semibold">{car.name}</h3>
            <div className="flex flex-wrap gap-2">
              {car.features.map((feature) => (
                <Badge key={feature} variant="outline">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
