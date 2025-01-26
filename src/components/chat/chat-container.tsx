"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatHeader } from "./chat-header";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";
import { Bot } from "lucide-react";
import { getRecommendations } from "@/app/actions/recommendations";
import type { VehicleScore } from "@/lib/recommendations/types";
import { CarCard } from "@/components/dashboard/car-card";

export type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  status?: "sending" | "sent" | "error";
  recommendation?: VehicleScore;
};

export function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([
    // Initial message will be set after recommendations are fetched
  ]);
  const [recommendations, setRecommendations] = useState<VehicleScore[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const data = await getRecommendations();
        setRecommendations(data);

        // Set initial message with top recommendation
        if (data.length > 0) {
          setMessages([
            {
              id: "welcome",
              content: `Hi! I'm your Toyota AI assistant. Based on your preferences, your top recommendation is the ${data[0]?.vehicle.year} ${data[0]?.vehicle.make} ${data[0]?.vehicle.model}. Would you like to explore other options or learn more about this one?`,
              role: "assistant",
              timestamp: new Date(),
              status: "sent",
              recommendation: data[0],
            },
          ]);
        } else {
          setMessages([
            {
              id: "welcome",
              content:
                "Hi! I'm your Toyota AI assistant. I'm ready to help you find your perfect Toyota. Tell me about your preferences, or ask me any questions you have.",
              role: "assistant",
              timestamp: new Date(),
              status: "sent",
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
        setMessages([
          {
            id: "error",
            content:
              "There was an error fetching your recommendations. Please try again later.",
            role: "assistant",
            timestamp: new Date(),
            status: "error",
          },
        ]);
      }
    };

    fetchRecommendations();
  }, []);

  const addMessage = async (content: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content,
      role: "user",
      timestamp: new Date(),
      status: "sent",
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI response with car recommendations
    setTimeout(async () => {
      try {
        // Example: Show a random car card
        const randomIndex = Math.floor(Math.random() * recommendations.length);
        const recommendation = recommendations[randomIndex];

        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          content: `Here's a vehicle you might like: the ${recommendation?.vehicle.year} ${recommendation?.vehicle.make} ${recommendation?.vehicle.model}.`,
          role: "assistant",
          timestamp: new Date(),
          status: "sent",
          recommendation,
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } finally {
        setIsTyping(false);
      }
    }, 2000);
  };

  return (
    <div className="flex h-full flex-col">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative flex h-full flex-col"
      >
        <div className="bg-dot-pattern absolute inset-0 opacity-5" />
        <div className="relative flex-1">
          <ChatMessages messages={messages} isTyping={isTyping} />
        </div>
        <ChatInput onSend={addMessage} isTyping={isTyping} />
      </motion.div>
    </div>
  );
}
