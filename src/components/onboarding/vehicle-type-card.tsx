"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import type { VehicleType } from "@/types/onboarding";

interface VehicleTypeCardProps {
  type: VehicleType;
  icon: string;
  isSelected: boolean;
  onClick: () => void;
}

export function VehicleTypeCard({
  type,
  icon,
  isSelected,
  onClick,
}: VehicleTypeCardProps) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Card
        className={`relative cursor-pointer p-4 transition-colors ${
          isSelected ? "border-primary bg-primary/10" : "hover:bg-muted/50"
        }`}
        onClick={onClick}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <span className="font-medium">{type}</span>
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute right-4"
            >
              <Check className="h-5 w-5 text-primary" />
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
