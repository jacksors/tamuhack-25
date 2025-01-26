"use client";

import { motion } from "framer-motion";
import { Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Link from "next/link";

export function WelcomeCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-2 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2,
            }}
            className="mx-auto"
          >
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Car className="h-8 w-8 text-primary" />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-3xl font-bold tracking-tight">
              Find Your Perfect Toyota Match! 🚗✨
            </h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-lg text-muted-foreground">
              Answer a few questions and let us find the ideal Toyota that
              matches your lifestyle and preferences.
            </p>
          </motion.div>
        </CardHeader>
        <CardContent className="space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-3 gap-4 rounded-lg bg-muted/50 p-4"
          >
            <div className="text-center">
              <div className="text-lg font-medium">2 min</div>
              <div className="text-sm text-muted-foreground">Quiz Time</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-medium">10</div>
              <div className="text-sm text-muted-foreground">Questions</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-medium">100%</div>
              <div className="text-sm text-muted-foreground">Personalized</div>
            </div>
          </motion.div>
        </CardContent>
        <CardFooter>
          <motion.div
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link href="/onboarding/vehicle-type" className="w-full">
              <Button size="lg" className="w-full">
                Get Started
              </Button>
            </Link>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
