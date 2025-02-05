"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const screenshots = [
  {
    title: "Personalized Onboarding",
    description: "Interactive questionnaire to understand user preferences",
    image: "/screenshots/onboarding.png",
    tags: ["User Experience", "Animation"],
  },
  {
    title: "AI Chat Interface",
    description: "Natural conversation with Toyota AI Assistant",
    image: "/screenshots/chat.png",
    tags: ["AI", "Interaction"],
  },
  {
    title: "Vehicle Recommendations",
    description: "Personalized vehicle matches with detailed analysis",
    image: "/screenshots/recommendations.png",
    tags: ["Matching", "Analysis"],
  },
  {
    title: "Vehicle Details",
    description: "In-depth vehicle information and comparison",
    image: "/screenshots/details.png",
    tags: ["Information", "UI"],
  },
];

export function ScreenshotsSection() {
  return (
    <section className="py-20">
      <div className="container px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tighter md:text-4xl">
            Project Showcase
          </h2>
          <p className="mx-auto max-w-[800px] text-muted-foreground md:text-lg">
            Take a look at the key features and interfaces that make DreamDrive
            unique.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {screenshots.map((screenshot, index) => (
            <motion.div
              key={screenshot.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden">
                <div className="relative aspect-video">
                  <div className="bg-dot-pattern absolute inset-0 opacity-10" />
                  <img
                    src={screenshot.image || "/placeholder.svg"}
                    alt={screenshot.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-semibold">
                    {screenshot.title}
                  </h3>
                  <p className="mb-4 text-muted-foreground">
                    {screenshot.description}
                  </p>
                  <div className="flex gap-2">
                    {screenshot.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
