import { UserPreferences } from "@/lib/recommendations/types";
import { createHash } from "crypto";

export function hashPreferences(preferences: UserPreferences): string {
  const sortedPrefs = JSON.stringify(
    preferences,
    Object.keys(preferences).sort(),
  );
  return createHash("sha256").update(sortedPrefs).digest("hex");
}
