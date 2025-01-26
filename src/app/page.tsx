import { HeroSection } from "@/components/sections/hero-section";
import { PreferencesSection } from "@/components/sections/preferences-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { FeaturedCarsSection } from "@/components/sections/featured-cars-section";
import { CTASection } from "@/components/sections/cta-section";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <PreferencesSection />
      <FeaturesSection />
      <FeaturedCarsSection />
      <CTASection />
    </div>
  );
}
