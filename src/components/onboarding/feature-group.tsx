"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Feature {
  id: string;
  label: string;
  icon: string;
}

interface FeatureGroupProps {
  title: string;
  features: Feature[];
  selectedFeatures: string[];
  onToggleFeature: (id: string) => void;
  delay?: number;
}

export function FeatureGroup({
  title,
  features,
  selectedFeatures,
  onToggleFeature,
  delay = 0,
}: FeatureGroupProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">{title}</h3>
        </CardHeader>
        <CardContent className="grid gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + index * 0.1 }}
              className="flex items-center space-x-3"
            >
              <Checkbox
                id={feature.id}
                checked={selectedFeatures.includes(feature.id)}
                onCheckedChange={() => onToggleFeature(feature.id)}
              />
              <Label
                htmlFor={feature.id}
                className="flex cursor-pointer items-center gap-2"
              >
                <span className="text-xl">{feature.icon}</span>
                <span>{feature.label}</span>
              </Label>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
