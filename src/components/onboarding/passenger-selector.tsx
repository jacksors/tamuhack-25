"use client";

import { motion } from "framer-motion";
import { Minus, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PassengerSelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function PassengerSelector({
  value,
  onChange,
  min = 2,
  max = 8,
}: PassengerSelectorProps) {
  const decrease = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const increase = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        className="relative"
      >
        <div className="flex h-32 w-32 items-center justify-center rounded-full bg-primary/10">
          <Users className="h-16 w-16 text-primary" />
        </div>
        <motion.div
          key={value}
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground"
        >
          {value}
        </motion.div>
      </motion.div>

      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={decrease}
          disabled={value <= min}
          className="h-12 w-12 rounded-full"
        >
          <Minus className="h-6 w-6" />
        </Button>
        <div className="w-24 text-center">
          <div className="text-3xl font-bold">{value}</div>
          <div className="text-sm text-muted-foreground">Passengers</div>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={increase}
          disabled={value >= max}
          className="h-12 w-12 rounded-full"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        {value === max ? (
          <span>Maximum capacity reached</span>
        ) : value === min ? (
          <span>Minimum {min} passengers required</span>
        ) : (
          <span>Including driver</span>
        )}
      </div>
    </div>
  );
}
