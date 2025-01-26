"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CarPreview } from "./car-preview";
import { Badge } from "./badge";
import { getRandomCar } from "@/app/actions/cars";
import { Vehicle } from "@/lib/recommendations/types";

export function AnimatedCarList() {
  const [cars, setCars] = useState([]) as any;
  const [recentMatch, setRecentMatch] = useState<string | null>(null);

  const addNewCar = useCallback(async () => {
    try {
      const newCar = await getRandomCar(1) as Vehicle;
      setCars((prev : any) => [newCar, ...prev.slice(0, 2)]);
      if (newCar) setRecentMatch(newCar.id);
      setTimeout(() => setRecentMatch(null), 3000);
    } catch (error) {
      console.error("Error fetching random car:", error);
    }
  }, []);

  const fetchInitialCars = useCallback(async () => {
    try {
      const newCars = await getRandomCar(3);
      setCars(newCars);
    } catch (error) {
      console.error("Error fetching initial cars:", error);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      addNewCar();
    }, 7000);

    // Fetch initial cars
    fetchInitialCars();

    return () => clearInterval(interval);
  }, [addNewCar]);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence mode="popLayout">
        {cars.map((car : any) => (
          <motion.div
            key={car["id"]}
            layout
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className="relative"
          >
            <CarPreview
              car={car}
            />
            <AnimatePresence>
              {recentMatch === car.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute left-4 top-4 z-10"
                >
                  <Badge className="bg-primary text-primary-foreground">
                    Just matched!
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
