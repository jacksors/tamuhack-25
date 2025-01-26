"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useChat, type Message as BaseMessage } from "ai/react";
import { ChatHeader } from "./chat-header";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";
// import { getRecommendations } from "@/app/actions/recommendations"
// type { VehicleScore } from "@/lib/recommendations/types"

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
  const { messages, append, isLoading } = useChat({
    initialMessages: [
      { role: "assistant", content: "Hello! How can I help?", id: "01" },
    ],
  });
  const typedMessages = messages as Message[];

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
