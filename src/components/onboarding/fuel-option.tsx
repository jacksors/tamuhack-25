"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface FuelOptionProps {
  value: string;
  icon: string;
  title: string;
  description: string;
  isSelected: boolean;
  onSelect: () => void;
}

export function FuelOption({
  value,
  icon,
  title,
  description,
  isSelected,
  onSelect,
}: FuelOptionProps) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Card
        className={`relative cursor-pointer p-6 transition-colors ${
          isSelected ? "border-primary bg-primary/10" : "hover:bg-muted/50"
        }`}
        onClick={onSelect}
      >
        <RadioGroup value={isSelected ? value : ""}>
          <div className="flex items-start space-x-4">
            <RadioGroupItem value={value} id={value} className="mt-1" />
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{icon}</span>
                <Label
                  htmlFor={value}
                  className="cursor-pointer text-lg font-medium"
                >
                  {title}
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
        </RadioGroup>
      </Card>
    </motion.div>
  );
}
