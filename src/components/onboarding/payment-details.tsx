"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaymentDetailsProps {
  type: string;
  values: {
    budget?: number;
    monthlyPayment?: number;
    creditScore?: string;
    downPayment?: number;
  };
  onChange: (key: string, value: any) => void;
}

const creditScoreRanges = [
  { value: "excellent", label: "Excellent (720+)" },
  { value: "good", label: "Good (690-719)" },
  { value: "fair", label: "Fair (630-689)" },
  { value: "poor", label: "Poor (629 or less)" },
];

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
    },
  }),
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
    },
  },
};

export function PaymentDetails({
  type,
  values,
  onChange,
}: PaymentDetailsProps) {
  if (!type) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="space-y-4 pt-4"
    >
      <AnimatePresence mode="wait">
        {type === "cash" && (
          <motion.div
            key="cash"
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            custom={0}
            className="space-y-2"
          >
            <Label htmlFor="budget">What's your budget?</Label>
            <Input
              id="budget"
              type="number"
              placeholder="Enter amount"
              value={values.budget || ""}
              onChange={(e) => onChange("budget", Number(e.target.value))}
            />
          </motion.div>
        )}

        {(type === "finance" || type === "lease") && (
          <motion.div key="finance-lease">
            <motion.div
              key="monthly-payment"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              custom={0}
              className="space-y-2"
            >
              <Label htmlFor="monthlyPayment">Maximum monthly payment</Label>
              <Input
                id="monthlyPayment"
                type="number"
                placeholder="Enter amount"
                value={values.monthlyPayment || ""}
                onChange={(e) =>
                  onChange("monthlyPayment", Number(e.target.value))
                }
              />
            </motion.div>

            <motion.div
              key="credit-score"
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              custom={1}
              className="mt-4 space-y-2"
            >
              <Label htmlFor="creditScore">Credit score range</Label>
              <Select
                value={values.creditScore}
                onValueChange={(value) => onChange("creditScore", value)}
              >
                <SelectTrigger id="creditScore">
                  <SelectValue placeholder="Select credit score range" />
                </SelectTrigger>
                <SelectContent>
                  {creditScoreRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {type === "finance" && (
          <motion.div
            key="down-payment"
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            custom={2}
            className="space-y-2"
          >
            <Label htmlFor="downPayment">Down payment amount</Label>
            <Input
              id="downPayment"
              type="number"
              placeholder="Enter amount"
              value={values.downPayment || ""}
              onChange={(e) => onChange("downPayment", Number(e.target.value))}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
