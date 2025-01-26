"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PreferenceOption {
  icon: string;
  label: string;
}

interface PreferenceCardProps {
  title: string;
  options: PreferenceOption[];
  delay?: number;
}

export function PreferenceCard({
  title,
  options,
  delay = 0,
}: PreferenceCardProps) {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
    >
      <Card>
        <CardContent className="p-6">
          <h3 className="mb-4 text-lg font-semibold">{title}</h3>
          <div className="flex flex-wrap gap-2">
            {options.map((option, index) => (
              <motion.div
                key={option.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: delay + index * 0.1 }}
              >
                <Button variant="outline" className="gap-2">
                  {option.icon} {option.label}
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
