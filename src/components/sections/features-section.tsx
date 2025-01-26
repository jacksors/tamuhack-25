"use client";

import { Heart, Map, Clock, Filter, Star, Settings } from "lucide-react";
import { FeatureCard } from "@/components/ui/feature-card";

export function FeaturesSection() {
  return (
    <section className="flex py-20 justify-center">
      <div className="container px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tighter md:text-4xl">
            Intelligent Features
          </h2>
          <p className="mx-auto max-w-[800px] text-muted-foreground md:text-lg">
            Experience the future of car shopping with our smart features
            designed to make your journey seamless and enjoyable
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={Heart}
            title="Personalized Matching"
            description="Our AI learns your preferences to find your perfect Toyota match."
            delay={0.1}
          />
          <FeatureCard
            icon={Map}
            title="Local Inventory"
            description="Search real-time inventory from Toyota dealers in your area."
            delay={0.2}
          />
          <FeatureCard
            icon={Clock}
            title="Quick Process"
            description="Find and connect with dealers in minutes, not hours."
            delay={0.3}
          />
          <FeatureCard
            icon={Filter}
            title="Smart Filters"
            description="Advanced filtering options to narrow down your perfect vehicle."
            delay={0.4}
          />
          <FeatureCard
            icon={Star}
            title="Save Favorites"
            description="Keep track of your favorite vehicles and compare them easily."
            delay={0.5}
          />
          <FeatureCard
            icon={Settings}
            title="Custom Alerts"
            description="Get notified when your dream Toyota becomes available."
            delay={0.6}
          />
        </div>
      </div>
    </section>
  );
}
