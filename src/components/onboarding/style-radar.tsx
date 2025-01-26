"use client";

import { motion } from "framer-motion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

interface StyleRadarProps {
  data: {
    comfort: number;
    performance: number;
    technology: number;
    safety: number;
    efficiency: number;
  };
}

export function StyleRadar({ data }: StyleRadarProps) {
  const chartData = [
    { subject: "Comfort", value: data.comfort },
    { subject: "Performance", value: data.performance },
    { subject: "Technology", value: data.technology },
    { subject: "Safety", value: data.safety },
    { subject: "Efficiency", value: data.efficiency },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="h-[300px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid stroke="hsl(var(--muted-foreground))" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "hsl(var(--muted-foreground))" }}
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false}/>
          <Radar
            name="Style"
            dataKey="value"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
