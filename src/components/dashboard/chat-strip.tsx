"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bot, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { ChatContainer } from "../chat/chat-container";

export function ChatStrip() {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isExpanded]);

  return (
    <>
      {/* Overlay when expanded */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>

      {/* Add placeholder div to maintain space */}
      {isExpanded && <div className="h-[120px] w-full" />}

      {/* Chat Container */}
      <motion.div
        layout
        initial={{ height: "auto" }}
        animate={{
          height: isExpanded ? "calc(100vh - 60px)" : "auto",
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        className={cn(
          "relative z-50 mx-auto max-w-6xl",
          isExpanded ? "fixed inset-x-4 -top-6" : "w-full",
        )}
      >
        <Card
          className={cn(
            "group h-full overflow-hidden bg-gradient-to-b from-background to-muted/50 transition-all",
            isExpanded ? "shadow-2xl" : "cursor-pointer hover:shadow-lg",
          )}
          onClick={() => !isExpanded && setIsExpanded(true)}
        >
          <motion.div layout className="relative h-full">
            <div className="bg-dot-pattern absolute inset-0 opacity-5" />

            {/* Header Section - Always Visible */}
            <motion.div
              layout="position"
              className="relative flex items-center gap-4 border-b p-6"
            >
              <motion.div
                layout="position"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10"
              >
                <Bot className="h-6 w-6 text-primary" />
              </motion.div>
              <div className="flex-1 space-y-1">
                <motion.h3 layout="position" className="font-semibold">
                  Toyota AI Assistant
                </motion.h3>
                <motion.p
                  layout="position"
                  className="text-sm text-muted-foreground"
                >
                  Get instant answers about vehicles and recommendations
                </motion.p>
              </div>
              {!isExpanded ? (
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                >
                  <Button size="icon" className="shrink-0">
                    <MessageSquare className="h-5 w-5" />
                  </Button>
                </motion.div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(false);
                  }}
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </motion.div>

            {/* Welcome Message - Only visible when collapsed */}
            <AnimatePresence>
              {!isExpanded && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-3 border-t bg-muted/50 px-6 py-3"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <p className="text-sm">
                    Hi! I can help you explore Toyota vehicles and answer any
                    questions you have.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chat Interface - Only visible when expanded */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-x-0 bottom-0 top-[89px]" // Height of header + border
                >
                  <ChatContainer />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </Card>
      </motion.div>
    </>
  );
}
