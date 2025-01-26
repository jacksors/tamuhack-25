"use client";

import { motion } from "framer-motion";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export function MatchScore() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.2,
      }}
      className="mx-auto h-32 w-32 md:mx-0"
    >
      <CircularProgressbar
        value={98}
        text={`98%`}
        styles={buildStyles({
          pathColor: "hsl(var(--primary))",
          textColor: "hsl(var(--primary))",
          trailColor: "hsl(var(--primary) / 0.1)",
        })}
      />
    </motion.div>
  );
}
