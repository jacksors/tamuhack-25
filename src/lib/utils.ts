import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export type NullableToOptional<T> = {
  // Iterate over each key in T
  [K in keyof T as null extends T[K] ? K : never]?: Exclude<T[K], null>;
} & {
  // Retain keys that do not include null
  [K in keyof T as null extends T[K] ? never : K]: T[K];
};
