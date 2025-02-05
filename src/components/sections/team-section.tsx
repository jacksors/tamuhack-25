"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Github, Globe, Linkedin } from "lucide-react";
import Link from "next/link";

const teamMembers = [
  {
    name: "Aiden Stickney",
    role: "Full Stack Developer",
    image: "/headshots/aiden.jpeg",
    github: "https://github.com/aidenstickney",
    linkedin: "https://linkedin.com/in/aidenstickney",
  },
  {
    name: "Jackson Stone",
    role: "Full Stack Developer",
    image: "/headshots/jackson.jpeg",
    github: "https://github.com/jacksors",
    linkedin: "https://linkedin.com/in/jacksonrstone",
    website: "https://jacksonstone.dev",
  },
  {
    name: "Theresia Heimer",
    role: "UI/UX Designer",
    image: "/headshots/theresia.jpeg",
    linkedin: "https://linkedin.com/in/theresia-heimer",
  },
];

export function TeamSection() {
  return (
    <section className="py-20">
      <div className="container px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tighter md:text-4xl">
            Meet the Team
          </h2>
          <p className="mx-auto max-w-[800px] text-muted-foreground md:text-lg">
            The individuals behind DreamDrive who brought this project to life
            in 24 hours.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="mb-4 aspect-square overflow-hidden rounded-full">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="mb-1 text-center text-lg font-semibold">
                    {member.name}
                  </h3>
                  <p className="mb-4 text-center text-sm text-muted-foreground">
                    {member.role}
                  </p>
                  <div className="flex justify-center gap-4">
                    {member.github && (
                      <Link
                        href={member.github}
                        target="_blank"
                        className="text-muted-foreground hover:text-primary"
                      >
                        <Github className="h-5 w-5" />
                      </Link>
                    )}
                    <Link
                      href={member.linkedin}
                      target="_blank"
                      className="text-muted-foreground hover:text-primary"
                    >
                      <Linkedin className="h-5 w-5" />
                    </Link>
                    {member.website && (
                      <Link
                        href={member.website}
                        target="_blank"
                        className="text-muted-foreground hover:text-primary"
                      >
                        <Globe className="h-5 w-5" />
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
