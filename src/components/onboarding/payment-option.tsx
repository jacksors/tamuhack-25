"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Wallet, Calculator } from "lucide-react";

interface PaymentOptionProps {
  value: string;
  title: string;
  description: string;
  isSelected: boolean;
  onSelect: () => void;
}

export function PaymentOption({
  value,
  title,
  description,
  isSelected,
  onSelect,
}: PaymentOptionProps) {
  const icons = {
    cash: Wallet,
    finance: Calculator,
    lease: CreditCard,
  };

  const Icon = icons[value as keyof typeof icons];

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Card
        className={`relative cursor-pointer p-6 transition-colors ${
          isSelected ? "border-primary bg-primary/10" : "hover:bg-muted/50"
        }`}
        onClick={onSelect}
      >
        <RadioGroup value={isSelected ? value : ""}>
          <div className="flex items-start space-x-4">
            <RadioGroupItem value={value} id={value} className="mt-1" />
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <Icon className="h-5 w-5 text-primary" />
                <Label
                  htmlFor={value}
                  className="cursor-pointer text-lg font-medium"
                >
                  {title}
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
        </RadioGroup>
      </Card>
    </motion.div>
  );
}
