"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Github, Linkedin } from "lucide-react";
import Link from "next/link";

const teamMembers = [
  {
    name: "Team Member 1",
    role: "Full Stack Developer",
    image: "/team/member1.jpg",
    github: "https://github.com/member1",
    linkedin: "https://linkedin.com/in/member1",
  },
  {
    name: "Team Member 2",
    role: "AI Engineer",
    image: "/team/member2.jpg",
    github: "https://github.com/member2",
    linkedin: "https://linkedin.com/in/member2",
  },
  {
    name: "Team Member 3",
    role: "UI/UX Designer",
    image: "/team/member3.jpg",
    github: "https://github.com/member3",
    linkedin: "https://linkedin.com/in/member3",
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
            The talented individuals behind DreamDrive who brought this project
            to life in 24 hours.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
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
                    <Link
                      href={member.github}
                      target="_blank"
                      className="text-muted-foreground hover:text-primary"
                    >
                      <Github className="h-5 w-5" />
                    </Link>
                    <Link
                      href={member.linkedin}
                      target="_blank"
                      className="text-muted-foreground hover:text-primary"
                    >
                      <Linkedin className="h-5 w-5" />
                    </Link>
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
