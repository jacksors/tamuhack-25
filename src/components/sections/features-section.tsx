"use client";

import { motion } from "framer-motion";
import { Bot, Car, Sparkles, Users, Cpu, Palette } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Bot,
    title: "Natural Conversation",
    description:
      "AI-powered chat interface that understands user needs and provides personalized recommendations",
  },
  {
    icon: Car,
    title: "Vehicle Matching",
    description:
      "Sophisticated algorithm that matches users with their ideal Toyota vehicle based on preferences",
  },
  {
    icon: Sparkles,
    title: "Interactive Experience",
    description:
      "Engaging onboarding flow with smooth animations and intuitive interface",
  },
  {
    icon: Users,
    title: "User-Centric Design",
    description:
      "Carefully crafted user experience that makes car shopping enjoyable and efficient",
  },
  {
    icon: Cpu,
    title: "Modern Technology",
    description:
      "Built with Next.js 15, TypeScript, and deployed to a custom AWS serverless stack",
  },
  {
    icon: Palette,
    title: "Beautiful Design",
    description:
      "Modern, responsive design with attention to detail and smooth animations",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20" id="features">
      <div className="container px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tighter md:text-4xl">
            Key Features
          </h2>
          <p className="mx-auto max-w-[800px] text-muted-foreground md:text-lg">
            DreamDrive combines artificial intelligence, user experience, and
            modern web technologies to create a unique car shopping experience.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <feature.icon className="mb-4 h-12 w-12 text-primary" />
                  <h3 className="mb-2 text-lg font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
