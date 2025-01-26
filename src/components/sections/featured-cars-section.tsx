import { CarPreview } from "@/components/ui/car-preview";

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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <CarPreview
            name="Toyota Camry Hybrid"
            price="$27,990"
            type="Hybrid Sedan"
            image="/placeholder.svg?height=200&width=300"
            delay={0.1}
          />
          <CarPreview
            name="Toyota RAV4 Prime"
            price="$32,990"
            type="Plug-in Hybrid SUV"
            image="/placeholder.svg?height=200&width=300"
            delay={0.2}
          />
          <CarPreview
            name="Toyota Highlander Hybrid"
            price="$39,990"
            type="Hybrid SUV"
            image="/placeholder.svg?height=200&width=300"
            delay={0.3}
          />
        </div>
      </div>
    </section>
  );
}
