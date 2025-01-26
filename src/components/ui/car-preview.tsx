"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car } from "lucide-react";
import { Vehicle } from "@/lib/recommendations/types";
import Spinner from "@/components/Spinner";
import { formatCurrency } from "@/lib/utils";

interface CarPreviewProps {
  car: Vehicle
  delay?: number
}

export function CarPreview({
  car,
  delay = 0,
}: CarPreviewProps) {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative aspect-video">
            <Spinner
              colorCodes={car.colorCodes ?? ""}
              model={car.model ?? ""}
              modelTag={car.modelTag ?? ""}
              modelGrade={car.modelGrade ?? ""}
              imageIndexOverride={35}
              imageCountOverride={car.imageCount ?? 36}
              card={true}
              noPadding={true}
            />
            <Badge className="absolute right-4 top-4">
              {" "}
              {formatCurrency(car.msrp || 0)}
            </Badge>
          </div>
          <div className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <Car className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">
                {" "}
                {car.vehicleSizeClass || "Mid-Size"}
              </span>
            </div>
            <h3 className="font-semibold">{car.year} {car.make} {car.model}</h3>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
