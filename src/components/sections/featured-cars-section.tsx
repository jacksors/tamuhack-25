import { AnimatedCarList } from "@/components/ui/animated-car-list";

export function FeaturedCarsSection() {
  return (
    <section className="py-20">
      <div className="container px-4 md:px-6">
        <div className="mb-12 flex flex-col items-center justify-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
            Popular Choices
          </h2>
          <p className="text-muted-foreground">
            Discover what other dreamers are falling in love with
          </p>
        </div>
        <AnimatedCarList />
      </div>
    </section>
  );
}
