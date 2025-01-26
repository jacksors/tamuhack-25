"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressHeader } from "@/components/onboarding/progress-header";
import { PriorityItem } from "@/components/onboarding/priority-item";
import {
  saveOnboardingData,
  getOnboardingData,
} from "@/lib/onboarding-storage";

const initialPriorities = [
  {
    id: "fuel-efficiency",
    label: "Fuel efficiency",
    description: "Better mileage and lower fuel costs",
    icon: "⛽",
  },
  {
    id: "safety",
    label: "Safety features",
    description: "Advanced safety technologies and ratings",
    icon: "🛡️",
  },
  {
    id: "cargo",
    label: "Cargo space",
    description: "Storage capacity and versatility",
    icon: "📦",
  },
  {
    id: "maintenance",
    label: "Low maintenance costs",
    description: "Affordable upkeep and repairs",
    icon: "🔧",
  },
  {
    id: "tech",
    label: "Advanced tech",
    description: "Modern infotainment and connectivity",
    icon: "🎮",
  },
  {
    id: "performance",
    label: "Performance/Speed",
    description: "Power and driving dynamics",
    icon: "🏎️",
  },
  {
    id: "resale",
    label: "Resale value",
    description: "Strong value retention",
    icon: "💰",
  },
  {
    id: "eco",
    label: "Environmental friendliness",
    description: "Lower emissions and eco-features",
    icon: "🌱",
  },
];

export default function PrioritiesPage() {
  const router = useRouter();
  const [priorities, setPriorities] = useState(initialPriorities);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    const saved = getOnboardingData();
    if (saved.priorities) {
      // Reconstruct the full priority items with their metadata
      const savedPriorities = saved.priorities.map(
        (id) => initialPriorities.find((p) => p.id === id)!,
      );
      setPriorities(savedPriorities);
    }
  }, []);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setPriorities((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  const handleNext = () => {
    saveOnboardingData({
      priorities: priorities.map((p) => p.id),
    });
    router.push("/onboarding/features");
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <ProgressHeader currentStep={4} totalSteps={10} />

        <Card>
          <CardHeader className="space-y-2 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-2xl font-bold">
                What Are Your Top Priorities?
              </h1>
              <p className="text-muted-foreground">
                Drag and drop to rank these features in order of importance to
                you
              </p>
            </motion.div>
          </CardHeader>

          <CardContent>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={priorities}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {priorities.map((priority, index) => (
                    <motion.div
                      key={priority.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <PriorityItem {...priority} />
                    </motion.div>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </CardContent>

          <CardFooter>
            <div className="flex w-full flex-col gap-3 sm:flex-row">
              <Button
                variant="outline"
                className="sm:flex-1"
                onClick={() => router.back()}
              >
                Back
              </Button>
              <Button className="sm:flex-1" onClick={handleNext}>
                Next
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </main>
  );
}
