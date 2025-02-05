"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const technologies = [
  {
    category: "Frontend",
    items: [
      { name: "Next.js 15", description: "React framework with App Router" },
      { name: "TypeScript", description: "Type-safe JavaScript" },
      { name: "Tailwind CSS", description: "Utility-first CSS framework" },
      { name: "Framer Motion", description: "Animation library" },
      { name: "shadcn/ui", description: "UI component library" },
    ],
  },
  {
    category: "Backend",
    items: [
      { name: "Vercel AI SDK", description: "AI integration toolkit" },
      { name: "OpenAI", description: "GPT-4 language model" },
      { name: "DrizzleORM", description: "TypeScript ORM" },
      { name: "PostgreSQL", description: "Database" },
    ],
  },
  {
    category: "Infrastructure",
    items: [
      { name: "AWS", description: "Cloud services" },
      { name: "SST", description: "Automatic provision and deployments" },
      { name: "Pulumi", description: "Infrastructure as code" },
      { name: "GitHub", description: "Version control" },
    ],
  },
];

export function TechStackSection() {
  return (
    <section className="py-20">
      <div className="container px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tighter md:text-4xl">
            Technology Stack
          </h2>
          <p className="mx-auto max-w-[800px] text-muted-foreground md:text-lg">
            Built with modern technologies and best practices for performance,
            scalability, and developer experience.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-lg font-semibold">
                    {tech.category}
                  </h3>
                  <ul className="space-y-3">
                    {tech.items.map((item) => (
                      <li key={item.name} className="flex flex-col">
                        <span className="font-medium text-primary">
                          {item.name}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {item.description}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
