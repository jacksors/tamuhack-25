import { PreferenceCard } from "@/components/ui/preference-card";

export function PreferencesSection() {
  return (
    <section className="py-20">
      <div className="container px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tighter md:text-4xl">
            Personalize Your Search
          </h2>
          <p className="text-muted-foreground md:text-lg">
            Tell us your preferences, and we'll find your perfect match
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <PreferenceCard
            title="Lifestyle"
            options={[
              { icon: "🏃", label: "Active" },
              { icon: "👨‍👩‍👧‍👦", label: "Family" },
              { icon: "💼", label: "Business" },
              { icon: "🏕️", label: "Adventure" },
            ]}
            delay={0.1}
          />
          <PreferenceCard
            title="Features"
            options={[
              { icon: "🛡️", label: "Safety" },
              { icon: "🎮", label: "Tech" },
              { icon: "⛽", label: "Efficiency" },
              { icon: "🏎️", label: "Performance" },
            ]}
            delay={0.2}
          />
          <PreferenceCard
            title="Usage"
            options={[
              { icon: "🌆", label: "City" },
              { icon: "🛣️", label: "Highway" },
              { icon: "⛰️", label: "Off-road" },
              { icon: "🅿️", label: "Easy-park" },
            ]}
            delay={0.3}
          />
        </div>
      </div>
    </section>
  );
}
