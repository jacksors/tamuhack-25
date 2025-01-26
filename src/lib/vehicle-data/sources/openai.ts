import { nanoid } from "nanoid";
import db from "@/server/db";
import { vehicleFeaturesCache } from "@/server/db/schema";
import { and, eq, gt } from "drizzle-orm";
import type { VehicleFeatures } from "../types";
import { USAGE_ANALYSIS_PROMPT } from "@/lib/recommendations/modules/usage";
import { createChatCompletion } from "@/lib/openai/client";

const featureDefinitions = {
  // Safety & Assistance
  awd: "All-wheel drive (AWD) system",
  "safety-package":
    "Advanced safety package including pre-collision system and automatic emergency braking",
  "lane-assist": "Lane departure warning and lane keeping assist",
  "blind-spot": "Blind spot monitoring with rear cross-traffic alert",

  // Comfort & Convenience
  sunroof: "Sunroof or moonroof",
  "heated-seats": "Heated front seats",
  "third-row": "Third-row seating",
  "wireless-charging": "Wireless phone charging pad",

  // Technology & Entertainment
  "large-screen": "Large touchscreen display (8 inches or larger)",
  "premium-audio": "Premium audio system (like JBL)",
  smartphone: "Apple CarPlay and Android Auto integration",
  "heads-up": "Heads-up display",

  // Performance & Capability
  towing: "Towing package or capability",
  "sport-mode": "Sport driving mode",
  "adaptive-suspension": "Adaptive or variable suspension system",
  "paddle-shifters": "Paddle shifters for manual gear control",
};

export async function getVehicleFeatures(
  year: string,
  model: string,
): Promise<VehicleFeatures & { usageAnalysis?: Record<string, any> }> {
  // Check cache first
  const cached = await db
    .select()
    .from(vehicleFeaturesCache)
    .where(
      and(
        eq(vehicleFeaturesCache.vehicleId, `${year}-${model}`),
        gt(
          vehicleFeaturesCache.lastUpdated,
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        ),
      ),
    )
    .then((res) => res[0]);

  if (cached) {
    return cached.features as VehicleFeatures & {
      usageAnalysis?: Record<string, any>;
    };
  }

  try {
    // Get both feature and usage analysis in parallel
    const [featureCompletion, usageCompletion] = await Promise.all([
      createChatCompletion(
        [
          {
            role: "system",
            content:
              "You are a Toyota vehicle specification expert. Provide accurate information about vehicle features, indicating uncertainty when appropriate.",
          },
          {
            role: "user",
            content: generateFeaturePrompt(year, model),
          },
        ],
        { estimatedTokens: 2000 },
      ),
      createChatCompletion(
        [
          {
            role: "system",
            content:
              "You are a Toyota vehicle usage expert. Analyze vehicles for their suitability in different use cases.",
          },
          {
            role: "user",
            content: `For the ${year} Toyota ${model}:\n${USAGE_ANALYSIS_PROMPT}`,
          },
        ],
        { estimatedTokens: 2000 },
      ),
    ]);

    const featureResponse = featureCompletion.choices[0]?.message?.content;
    const usageResponse = usageCompletion.choices[0]?.message?.content;

    if (!featureResponse) throw new Error("No feature response from OpenAI");

    const features = JSON.parse(featureResponse) as VehicleFeatures;
    const usageAnalysis = usageResponse ? JSON.parse(usageResponse) : undefined;

    const combined = {
      ...features,
      usageAnalysis: usageAnalysis?.useCases,
    };

    // Cache the results
    await db.insert(vehicleFeaturesCache).values({
      id: nanoid(),
      vehicleId: `${year}-${model}`,
      features: combined,
      source: "openai",
      confidence:
        Object.values(features.features).reduce(
          (acc, f) => acc + f.confidence,
          0,
        ) / Object.keys(features.features).length,
      lastUpdated: new Date(),
    });

    return combined;
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw error;
  }
}

function generateFeaturePrompt(year: string, model: string): string {
  const prompt = `
    Analyze the ${year} Toyota ${model} and determine which of these specific features it has.
    Only respond about these exact features - do not include any additional features.
    
    For each feature, provide:
    - Whether it's available (true/false)
    - Confidence in the answer (0-1)
    - Optional notes about trim levels or conditions
    
    Features to analyze:
    ${Object.entries(featureDefinitions)
      .map(([key, desc]) => `${key}: ${desc}`)
      .join("\n")}
    
    Format the response as a JSON object with this structure:
    {
      "features": {
        "feature-name": {
          "available": boolean,
          "confidence": number,
          "notes": string (optional)
        }
      },
      "trim_levels": string[] (optional),
      "standard_or_optional": "standard" | "optional" | "varies_by_trim"
    }
    
    Only mark a feature as available if you are confident it exists for this specific model year.
    If you're unsure, set confidence lower and provide notes about your uncertainty.
    If a feature is only available on certain trims, mark it as available but note which trims in the notes field.
  `;
  return prompt;
}
