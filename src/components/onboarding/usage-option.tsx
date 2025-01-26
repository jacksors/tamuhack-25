"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

interface UsageOptionProps {
  id: string;
  label: string;
  description: string;
  icon: string;
  isSelected: boolean;
  onToggle: () => void;
}

export function UsageOption({
  id,
  label,
  description,
  icon,
  isSelected,
  onToggle,
}: UsageOptionProps) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Card
        className={`relative cursor-pointer p-4 transition-colors ${
          isSelected ? "border-primary bg-primary/10" : "hover:bg-muted/50"
        }`}
        onClick={onToggle}
      >
        <div className="flex items-start gap-3">
          <span className="mt-1 text-2xl">{icon}</span>
          <div className="flex-1">
            <div className="font-medium">{label}</div>
            <div className="text-sm text-muted-foreground">{description}</div>
          </div>
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute right-4 top-4"
            >
              <Check className="h-5 w-5 text-primary" />
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
