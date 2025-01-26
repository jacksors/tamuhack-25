"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CarPreview } from "./car-preview";
import { Badge } from "./badge";

const initialCars = [
  {
    id: "1",
    name: "Toyota Camry Hybrid",
    price: "$27,990",
    type: "Hybrid Sedan",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "2",
    name: "Toyota RAV4 Prime",
    price: "$32,990",
    type: "Plug-in Hybrid SUV",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "3",
    name: "Toyota Highlander Hybrid",
    price: "$39,990",
    type: "Hybrid SUV",
    image: "/placeholder.svg?height=200&width=300",
  },
];

const newMatchCars = [
  {
    id: "4",
    name: "Toyota GR86",
    price: "$28,400",
    type: "Sports Car",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "5",
    name: "Toyota Corolla Cross",
    price: "$23,990",
    type: "Crossover SUV",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "6",
    name: "Toyota Crown",
    price: "$39,900",
    type: "Luxury Sedan",
    image: "/placeholder.svg?height=200&width=300",
  },
];

export function AnimatedCarList() {
  const [cars, setCars] = useState(initialCars);
  const [recentMatch, setRecentMatch] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const addNewCar = useCallback(() => {
    const newCar = newMatchCars[currentIndex] as (typeof newMatchCars)[0];
    setCars((prev) => [newCar, ...prev.slice(0, 2)]);
    setRecentMatch(newCar.id);
    setCurrentIndex((prev) => (prev + 1) % newMatchCars.length);

    // Clear the "Just matched!" badge after 3 seconds
    setTimeout(() => setRecentMatch(null), 3000);
  }, [currentIndex]);

  useEffect(() => {
    // Random interval between 5 and 10 seconds
    const interval = setInterval(() => {
      addNewCar();
    }, 7000);

    return () => clearInterval(interval);
  }, [addNewCar]);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence mode="popLayout">
        {cars.map((car) => (
          <motion.div
            key={car.id}
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
              name={car.name}
              price={car.price}
              type={car.type}
              image={car.image}
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
