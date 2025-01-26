"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { getMoreCars } from "@/app/actions/cars";
import { CarCard } from "./car-card";
import { Loader2 } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function CarGrid() {
  const [cars, setCars] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [ref, inView] = useInView();
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  async function loadMore() {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const newCars = await getMoreCars({ offset: (page - 1) * 12 });
      if (newCars.length < 12) {
        setHasMore(false);
      }
      setCars((prev) => [...prev, ...newCars]);
      setPage((p) => p + 1);
    } catch (error) {
      console.error("Error loading more cars:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (inView) {
      loadMore();
    }
  }, [inView, loadMore]); // Added loadMore to dependencies

  return (
    <div className="relative">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
      >
        {cars.map((car) => (
          <motion.div key={car.id} variants={item}>
            <CarCard car={car} />
          </motion.div>
        ))}
      </motion.div>

      <div
        ref={ref}
        className="col-span-full flex h-32 items-center justify-center"
      >
        {isLoading && (
          <div className="flex items-center gap-2 text-primary">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="font-medium">Loading more vehicles...</span>
          </div>
        )}
      </div>
    </div>
  );
}
