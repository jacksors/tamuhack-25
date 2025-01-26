"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChatHeader } from "./chat-header";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";
import { Bot, Car } from "lucide-react";

export type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  status?: "sending" | "sent" | "error";
};

export function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content:
        "Hi! I'm your Toyota AI assistant. I can help you explore our vehicles, answer questions about your recommendations, and provide detailed information about any Toyota model. What would you like to know?",
      role: "assistant",
      timestamp: new Date(),
      status: "sent",
    },
  ]);

  const [isTyping, setIsTyping] = useState(false);

  const addMessage = (content: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content,
      role: "user",
      timestamp: new Date(),
      status: "sent",
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI response (this will be replaced with actual API call)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content:
          "I understand you're interested in Toyota vehicles. Let me help you with that.",
        role: "assistant",
        timestamp: new Date(),
        status: "sent",
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
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
