"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { TypeIcon as type, type LucideIcon } from "lucide-react";

interface InsightCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  description: string;
  delay?: number;
}

export function InsightCard({
  icon: Icon,
  title,
  value,
  description,
  delay = 0,
}: InsightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -5 }}
    >
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">{title}</div>
              <div className="text-2xl font-bold">{value}</div>
              <div className="text-sm text-muted-foreground">{description}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
