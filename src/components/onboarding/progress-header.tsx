"use client";

import { motion } from "framer-motion";

interface ProgressHeaderProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressHeader({
  currentStep,
  totalSteps,
}: ProgressHeaderProps) {
  return (
    <div className="mx-auto mb-8 w-full max-w-md">
      <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Question {currentStep} of {totalSteps}
        </span>
        <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}
