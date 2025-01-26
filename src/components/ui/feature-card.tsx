"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { TypeIcon as type, type LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  delay = 0,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay }}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.2 },
      }}
    >
      <Card className="group relative overflow-hidden">
        <CardContent className="p-6">
          <motion.div
            className="mb-4"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Icon className="h-8 w-8 text-primary" />
          </motion.div>
          <h3 className="mb-2 text-lg font-semibold transition-colors group-hover:text-primary">
            {title}
          </h3>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
