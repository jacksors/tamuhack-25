"use client";

import { motion } from "framer-motion";

export function AnimatedGradient() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 2 }}
      >
        <svg
          className="absolute h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {[...Array(10)].map((_, i) => (
            <motion.path
              key={i}
              d={`M ${i * 10} 0 Q ${i * 10 + 5} 50 ${i * 10} 100`}
              stroke="currentColor"
              strokeWidth="0.5"
              fill="none"
              className="text-primary/10"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: i * 0.2 }}
            />
          ))}
        </svg>
      </motion.div>
    </div>
  );
}
