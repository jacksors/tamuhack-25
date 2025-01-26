"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface PreferenceChartProps {
  priorities: string[];
}

export function PreferenceChart({ priorities }: PreferenceChartProps) {
  const data = priorities.slice(0, 5).map((priority, index) => ({
    name: priority
      .replace(/-/g, " ")
      .replace(/(^\w|\s\w)/g, (l) => l.toUpperCase()),
    value: 100 - index * 15, // Decreasing importance
  }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="h-[300px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 100]} />
          <YAxis
            dataKey="name"
            type="category"
            width={100}
            tick={{ fill: "hsl(var(--muted-foreground))" }}
          />
          <Bar dataKey="value" background={{ fill: "hsl(var(--muted))" }}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill="hsl(var(--primary))"
                fillOpacity={1 - index * 0.15}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
