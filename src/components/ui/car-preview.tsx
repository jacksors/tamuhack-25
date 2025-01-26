"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car } from "lucide-react";

interface CarPreviewProps {
  name: string;
  price: string;
  type: string;
  image: string;
  delay?: number;
}

export function CarPreview({
  name,
  price,
  type,
  image,
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
            <img
              src={image || "/placeholder.svg"}
              alt={name}
              className="h-full w-full object-cover"
            />
            <Badge className="absolute right-4 top-4">{price}</Badge>
          </div>
          <div className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <Car className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">{type}</span>
            </div>
            <h3 className="font-semibold">{name}</h3>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
