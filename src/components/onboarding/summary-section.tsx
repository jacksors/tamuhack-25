"use client";

import { motion } from "framer-motion";
import { Check, type LucideIcon } from "lucide-react";

interface SummarySectionProps {
  title: string;
  items: (string | undefined)[];
  icon: LucideIcon;
  delay?: number;
  teaser?: string;
}

export function SummarySection({
  title,
  items,
  icon: Icon,
  delay = 0,
  teaser,
}: SummarySectionProps) {
  const filteredItems = items.filter((item): item is string => !!item);

  if (filteredItems.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="relative"
    >
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">{title}</h3>
      </div>
      <div className="space-y-2">
        {filteredItems.map((item, index) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + index * 0.1 }}
            className="flex items-start gap-2"
          >
            <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
            <span>{item}</span>
          </motion.div>
        ))}
        {teaser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + filteredItems.length * 0.1 }}
            className="ml-6 font-medium text-primary"
          >
            {teaser}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
