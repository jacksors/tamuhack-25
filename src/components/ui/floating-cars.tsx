"use client";

import { motion } from "framer-motion";
import { Car } from "lucide-react";

export function FloatingCars() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{
            x: -20,
            y: Math.random() * 100,
            opacity: 0,
          }}
          animate={{
            x: "120vw",
            y: Math.random() * 100,
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 3,
            ease: "linear",
          }}
        >
          <Car className="h-8 w-8 text-primary/20" />
        </motion.div>
      ))}
    </div>
  );
}
