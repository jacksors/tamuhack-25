"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useChat, type Message as BaseMessage } from "ai/react";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";
import { getRecommendations } from "@/app/actions/recommendations";
import type { VehicleScore } from "@/lib/recommendations/types";
import type { ToolInvocation } from "ai";

export interface Message extends BaseMessage {
  timestamp?: Date;
  cars?: Array<{
    id: string;
    name: string;
    price: number;
    score: number;
    features: string[];
  }>;
  toolInvocations?: ToolInvocation[];
}

export function ChatContainer() {
  const [recommendations, setRecommendations] = useState<VehicleScore[]>([]);

  const { messages, append, isLoading } = useChat({
    maxSteps: 5,
    initialMessages:
      recommendations.length > 0
        ? [
            {
              id: "01",
              role: "assistant",
              content: `Hi! I'm your Toyota AI assistant. I'm here to help you find your perfect vehicle match. Based on your preferences, I think you might be interested in the ${recommendations[0]!.vehicle.year} ${recommendations[0]!.vehicle.make} ${recommendations[0]!.vehicle.model}. Would you like to learn more about this model or explore other options that match your needs?`,
              toolInvocations: [
                {
                  toolName: "showRecommendation",
                  state: "result",
                  result: {
                    car: {
                      id: recommendations[0]!.vehicleId,
                      name: `${recommendations[0]!.vehicle.year} ${recommendations[0]!.vehicle.make} ${recommendations[0]!.vehicle.model}`,
                      price: recommendations[0]!.vehicle.msrp || 0,
                      score: recommendations[0]!.totalScore,
                      features: recommendations[0]!.metadata.matchingFeatures,
                    },
                  },
                  toolCallId: "initial",
                  args: [],
                },
              ],
            },
          ]
        : [],
    onError: (error) => {
      console.error("Chat error:", error);
      // You could add toast notifications here
    },
    onFinish: () => {
      // Handle chat completion
    },
  });

  const typedMessages = messages as Message[];

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const data = await getRecommendations();
        setRecommendations(data);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <div className="flex h-full flex-col">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative flex h-full flex-col"
      >
        <div className="bg-dot-pattern absolute inset-0 opacity-5" />
        <div className="relative flex-1 overflow-hidden">
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
