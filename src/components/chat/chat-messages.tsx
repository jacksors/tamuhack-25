"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";
import type { Message } from "./chat-container";
import { ChatTypingIndicator } from "./chat-typing-indicator";
import { CarCard } from "@/components/dashboard/car-card";
import { getCarDetails } from "@/app/actions/cars";
import { useCallback, useState } from "react";
import type { VehicleScore } from "@/lib/recommendations/types";

interface ChatMessagesProps {
  messages: Message[];
  isLoading?: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [carDetails, setCarDetails] = useState<Record<string, VehicleScore>>(
    {},
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [scrollRef]); // Updated dependency

  const fetchCarDetails = useCallback(
    async (carId: string) => {
      if (!carDetails[carId]) {
        const details = await getCarDetails(carId);
        if (details) {
          setCarDetails((prev) => ({ ...prev, [carId]: details }));
        }
      }
    },
    [carDetails],
  );

  useEffect(() => {
    // Fetch car details for any new cars in messages
    messages.forEach((message) => {
      if (message.cars) {
        message.cars.forEach((car) => {
          if (!carDetails[car.id]) {
            fetchCarDetails(car.id);
          }
        });
      }
    });
  }, [messages, carDetails, fetchCarDetails]);

  return (
    <ScrollArea ref={scrollRef} className="h-full">
      <div className="h-full overflow-y-auto px-4">
        <div className="flex flex-col gap-6 py-6">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="group flex items-start gap-3 px-2"
              >
                <Avatar className="h-8 w-8 border">
                  {message.role === "assistant" ? (
                    <>
                      <AvatarImage src="/toyota-ai.png" />
                      <AvatarFallback>
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </>
                  ) : (
                    <>
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </>
                  )}
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {message.role === "assistant" ? "Toyota AI" : "You"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                  <div
                    className={`rounded-xl px-4 py-2 text-sm ${
                      message.role === "assistant"
                        ? "bg-muted"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {message.content}
                  </div>
                  {/* Display car cards if available */}
                  {message.cars && (
                    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {message.cars.map((car) => {
                        const details = carDetails[car.id];
                        return details ? (
                          <div key={car.id} className="w-full max-w-[300px]">
                            <CarCard
                              recommendation={details}
                              detailsAvailable={false}
                            />
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-start gap-3 px-2"
              >
                <Avatar className="h-8 w-8 border">
                  <AvatarImage src="/toyota-ai.png" />
                  <AvatarFallback>
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Toyota AI</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="mt-2 rounded-xl bg-muted px-4 py-2">
                    <ChatTypingIndicator />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ScrollArea>
  );
}
