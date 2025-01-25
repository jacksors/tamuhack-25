"use client";

import { motion } from "framer-motion";

export function CarLogo() {
  return (
    <motion.div
      className="mb-8 h-16 w-16"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="h-full w-full text-primary"
      >
        <motion.path
          d="M5 17h14M6 11l3-7h6l3 7H6zm0 0h12v3H6v-3zm3-2h.01M15 9h.01"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2 }}
        />
      </svg>
    </motion.div>
  );
}
