import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative pb-16 pt-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              DreamDrive
            </h1>
            <h2 className="text-2xl font-bold text-primary">
              TAMUhack 2025 TFS Challenge Runner-Up
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              An AI-powered Toyota vehicle matchmaking platform that helps users
              find their perfect car through personalized recommendations and
              natural conversation.
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 pt-4 sm:flex-row">
            <Link
              href="https://github.com/jacksors/tamuhack-25"
              target="_blank"
            >
              <Button size="lg" className="gap-2">
                <Github className="h-5 w-5" />
                View on GitHub
              </Button>
            </Link>
            <Button variant="outline" size="lg" asChild>
              <Link href="https://devpost.com/software/dreamdrive">
                View Submission
              </Link>
            </Button>
          </div>
          <div className="pt-8">
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground">
                🏆 Awarded 2nd Place for the Toyota Financial Services challenge
                at TAMUhack 2025, Texas A&M's largest hackathon
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
