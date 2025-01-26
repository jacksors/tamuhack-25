"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function CarFinderForm() {
  const [budget, setBudget] = useState([30000]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle>Find Your Perfect Match</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Your Budget</Label>
            <Slider
              value={budget}
              onValueChange={setBudget}
              max={100000}
              step={1000}
              className="w-full"
            />
            <div className="text-right font-semibold text-primary">
              ${budget[0]?.toLocaleString()}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Preferred Location</Label>
            <Input placeholder="Enter your city or ZIP code" />
          </div>
          <Button className="w-full">Start Matching</Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
