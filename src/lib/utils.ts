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

export function nullableToOptional<T>(obj: T): NullableToOptional<T> {
  const result = {} as NullableToOptional<T>;

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      // Check if the value is not null
      if (value !== null) {
        // @ts-expect-error: We ensure type safety through the utility type
        result[key] = value;
      }
      // If the value is null, omit the property (make it optional)
    }
  }

  return result;
}
