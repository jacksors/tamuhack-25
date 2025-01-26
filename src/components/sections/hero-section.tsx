import { CarFinderForm } from "@/components/ui/car-finder-form";

export function HeroSection() {
  return (
    <section className="relative pb-32 pt-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Find Your Dream Toyota with{" "}
              <span className="text-primary">DreamDrive</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Your perfect Toyota match is waiting. Let our AI-powered system
              find your ideal vehicle based on your unique preferences and
              lifestyle.
            </p>
          </div>
          <div className="mt-8 w-full max-w-4xl">
            <CarFinderForm />
          </div>
        </div>
      </div>
    </section>
  );
}
