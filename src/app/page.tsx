"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center space-y-4"
          >
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Drive Innovation at TamuHack
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Join us for an extraordinary hackathon experience powered by
                Toyota. Transform your ideas into reality.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/signin">
                <Button className="w-full min-[400px]:w-auto">
                  Get Started
                </Button>
              </Link>
              <Button variant="outline" className="w-full min-[400px]:w-auto">
                Learn More
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto aspect-video w-full max-w-[600px] overflow-hidden rounded-xl"
          >
            <div className="h-full w-full bg-foreground/5 p-4">
              <div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed">
                <div className="flex flex-col items-center justify-center space-y-2 text-center">
                  <div className="size-12 rounded-full bg-primary/10">
                    <svg
                      className="m-3 size-6 text-primary"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                      <circle cx="7" cy="17" r="2" />
                      <path d="M9 17h6" />
                      <circle cx="17" cy="17" r="2" />
                    </svg>
                  </div>
                  <div className="max-w-[250px] space-y-1">
                    <h3 className="text-base font-medium">Powered by Toyota</h3>
                    <p className="text-sm text-muted-foreground">
                      Experience innovation in mobility
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
