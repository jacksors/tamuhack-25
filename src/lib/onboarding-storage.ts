"use client";

import type { OnboardingData } from "@/types/onboarding";

const STORAGE_KEY = "dreamdrive_onboarding";

export function saveOnboardingData(data: Partial<OnboardingData>) {
  const existing = getOnboardingData();
  const updated = { ...existing, ...data };
  if (typeof window !== "undefined") {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
  return updated;
}

export function getOnboardingData(): Partial<OnboardingData> {
  if (typeof window === "undefined") return {};

  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return {};

  try {
    return JSON.parse(stored);
  } catch {
    return {};
  }
}

export function clearOnboardingData() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(STORAGE_KEY);
  }
}
