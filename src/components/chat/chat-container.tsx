"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useChat, type Message as BaseMessage } from "ai/react";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";
import { getRecommendations } from "@/app/actions/recommendations";
import type { VehicleScore } from "@/lib/recommendations/types";

export interface Message extends BaseMessage {
  timestamp?: Date;
  cars?: Array<{
    id: string;
    name: string;
    price: number;
    score: number;
    features: string[];
  }>;
}

export function ChatContainer() {
  const [recommendations, setRecommendations] = useState<VehicleScore[]>([]);
  const [initialMessageSent, setInitialMessageSent] = useState(false);
  const { messages, append, isLoading } = useChat();
  const typedMessages = messages as Message[];

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const data = await getRecommendations();
        setRecommendations(data);

        // Set initial message with top recommendation
        if (data.length > 0 && !initialMessageSent) {
          const topMatch = data[0];
          if (topMatch) {
            await append({
              role: "assistant",
              content: `Hi! I'm your Toyota AI assistant. Based on your preferences, your top recommendation is the ${topMatch.vehicle.year} ${topMatch.vehicle.make} ${topMatch.vehicle.model}. Would you like to explore other options or learn more about this one?`,
              cars: [
                {
                  id: topMatch.vehicleId,
                  name: `${topMatch.vehicle.year} ${topMatch.vehicle.make} ${topMatch.vehicle.model}`,
                  price: topMatch.vehicle.msrp || 0,
                  score: topMatch.totalScore,
                  features: topMatch.metadata.matchingFeatures,
                },
              ],
            } as Message);
          }
          setInitialMessageSent(true);
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    fetchRecommendations();
  }, [append, initialMessageSent]);

  return (
    <div className="flex h-full flex-col">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative flex h-full flex-col"
      >
        <div className="bg-dot-pattern absolute inset-0 opacity-5" />
        <div className="relative flex-1">
          <ChatMessages messages={typedMessages} isLoading={isLoading} />
        </div>
        <ChatInput
          onSend={(content) => append({ role: "user", content })}
          isLoading={isLoading}
        />
      </motion.div>
    </div>
  );
}
