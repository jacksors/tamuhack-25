"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Your Dream Toyota is Waiting
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
              Join thousands of happy drivers who found their perfect match
              through DreamDrive
            </p>
          </div>
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <Button size="lg" className="mt-4">
              Start Your Journey Now
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
