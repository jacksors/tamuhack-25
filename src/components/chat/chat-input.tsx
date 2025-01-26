"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "@/components/ui/button";
import { ArrowUp, Bot } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="border-t bg-card px-4 py-4"
    >
      <form onSubmit={handleSubmit} className="relative">
        <TextareaAutosize
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything about Toyota vehicles..."
          className="w-full resize-none rounded-xl border bg-background px-4 py-3 pr-12 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          maxRows={5}
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="icon"
          className="absolute right-2 top-2 h-8 w-8 rounded-lg"
          disabled={!message.trim() || isLoading}
        >
          <ArrowUp className="h-5 w-5" />
          <span className="sr-only">Send message</span>
        </Button>
      </form>
      {isLoading && (
        <div className="mt-2 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Bot className="h-3 w-3 animate-pulse" />
          <span>Toyota AI is typing...</span>
        </div>
      )}
    </motion.div>
  );
}
