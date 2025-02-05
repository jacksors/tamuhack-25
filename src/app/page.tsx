import { AnimatedGradient } from "@/components/ui/animated-gradient";
import { FloatingCars } from "@/components/ui/floating-cars";
import { HeroSection } from "@/components/sections/hero-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { ScreenshotsSection } from "@/components/sections/screenshots-section";
import { TechStackSection } from "@/components/sections/tech-stack-section";
import { TeamSection } from "@/components/sections/team-section";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <AnimatedGradient />
      <FloatingCars />
      <HeroSection />
      <FeaturesSection />
      <ScreenshotsSection />
      <TechStackSection />
      <TeamSection />
    </div>
  );
}
