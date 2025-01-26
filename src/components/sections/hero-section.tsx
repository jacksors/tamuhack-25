import { AnimatedCTA } from "@/components/ui/animated-cta";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="flex pb-16 pt-36 justify-center">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Find Your Dream Toyota with{" "}
              <span className="text-primary">DreamDrive</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Discover the perfect Toyota for your lifestyle with our
              intelligent car matching system. Experience seamless car shopping
              like never before.
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 pt-4 sm:flex-row">
            <AnimatedCTA />
          </div>
        </div>
      </div>
    </section>
  );
}
