"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CircleDotDashed, Sparkles } from "lucide-react";
import { authClient } from "@/lib/auth/client";

export function AnimatedCTA() {
  const session = authClient.useSession;

  return (
    <motion.div className="group relative" whileHover="hover">
      <motion.div
        className="absolute inset-0 rounded-lg bg-primary/20"
        initial={{ scale: 1 }}
        variants={{
          hover: {
            scale: 1.5,
            opacity: 0,
            transition: { duration: 0.5 },
          },
        }}
      />

      {session ? (
        <Link href="/dashboard">
          <Button size="lg" className="group relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-primary/10"
              initial={{ x: "100%" }}
              variants={{
                hover: {
                  x: "-100%",
                  transition: { duration: 0.4 },
                },
              }}
            />
            <span className="relative flex items-center gap-2">
              My Dashboard
              <motion.span
                variants={{
                  hover: {
                    rotate: [0, 15, -15, 0],
                    transition: {
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 1,
                    },
                  },
                }}
              >
                <CircleDotDashed className="h-4 w-4" />
              </motion.span>
            </span>
          </Button>
        </Link>
      ) : (
        <Link href="/onboarding/welcome">
          <Button size="lg" className="group relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-primary/10"
              initial={{ x: "100%" }}
              variants={{
                hover: {
                  x: "-100%",
                  transition: { duration: 0.4 },
                },
              }}
            />
            <span className="relative flex items-center gap-2">
              Start Exploring
              <motion.span
                variants={{
                  hover: {
                    rotate: [0, 15, -15, 0],
                    transition: {
                      repeat: Number.POSITIVE_INFINITY,
                      duration: 1,
                    },
                  },
                }}
              >
                <Sparkles className="h-4 w-4" />
              </motion.span>
            </span>
          </Button>
        </Link>
      )}
    </motion.div>
  );
}
