import { streamText } from "ai";
import { getRecommendations } from "@/app/actions/recommendations";
import { getUserPreferences } from "@/app/actions/preferences";
import { getCarDetails } from "@/app/actions/cars";
import { z } from "zod";
import { createOpenAI } from "@ai-sdk/openai";
import { Resource } from "sst";

const openai = createOpenAI({
  compatibility: "strict",
  apiKey: Resource.OPENAI_API_KEY.value,
});

function errorHandler(error: unknown) {
  if (error == null) return "An unknown error occurred";
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  return JSON.stringify(error);
}

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o-mini"),
    toolCallStreaming: true,
    system: `You are a friendly and knowledgeable Toyota vehicle expert AI assistant.
    Your goal is to help users find their perfect Toyota vehicle through natural conversation.

    Guidelines:
    - Be conversational and friendly, but professional.
    - Ask follow-up questions to better understand the user's needs.
    - Use viewPreferences to understand the user's saved preferences.
    - Use searchCars when searching for matches based on criteria.
    - Use showRecommendation when you want to highlight a specific vehicle.
    - Explain why you're recommending certain vehicles based on the specific conversation context.
    - Focus on understanding their lifestyle, budget, and must-have features.
    - Don't overwhelm them with too many options at once.
    - Be enthusiastic about Toyota vehicles while remaining honest and helpful.
    - Construct natural responses that flow with the conversation.
    
    The goal of each message should be to show a user a recommendation with showRecommendation, be extremely liberaly with the use of this function! It should be on nearly every message.`,

    messages,
    tools: {
      viewPreferences: {
        description: "View the user's saved vehicle preferences",
        parameters: z.object({}),
        execute: async () => {
          try {
            const preferences = await getUserPreferences();
            if (!preferences) {
              return {
                hasPreferences: false,
                message:
                  "No saved preferences found. Would you like to go through our vehicle matcher?",
              };
            }
            return {
              hasPreferences: true,
              preferences: {
                vehicleTypes: preferences.vehicleTypes || [],
                usage: preferences.usage || [],
                features: preferences.features || [],
                fuelPreference: preferences.fuelPreference,
                passengerCount: preferences.passengerCount,
                budget: preferences.paymentPlan?.budget,
                location: preferences.location,
              },
            };
          } catch (error) {
            console.error("Error fetching preferences:", error);
            return { hasPreferences: false, error: errorHandler(error) };
          }
        },
      },
      searchCars: {
        description:
          "Search for Toyota vehicles based on criteria and return matching cars",
        parameters: z.object({
          type: z.string().optional(),
          maxPrice: z.number().optional(),
          features: z.array(z.string()).optional(),
          context: z.string(),
        }),
        execute: async ({ type, maxPrice, features }) => {
          try {
            const recommendations = await getRecommendations();
            const matches = recommendations.filter((rec) => {
              const vehicle = rec.vehicle;
              const meetsType =
                !type ||
                vehicle.vehicleSizeClass
                  ?.toLowerCase()
                  .includes(type.toLowerCase());
              const meetsPrice = !maxPrice || (vehicle.msrp || 0) <= maxPrice;
              const meetsFeatures =
                !features?.length ||
                features.every((feature: string) =>
                  rec.metadata.matchingFeatures.some((f) =>
                    f.toLowerCase().includes(feature.toLowerCase()),
                  ),
                );
              return meetsType && meetsPrice && meetsFeatures;
            });

            const topMatches = matches.slice(0, 3);
            return {
              cars: topMatches.map((match) => ({
                id: match.vehicleId,
                name: `${match.vehicle.year} ${match.vehicle.make} ${match.vehicle.model}`,
                price: match.vehicle.msrp || 0,
                score: match.totalScore,
                features: match.metadata.matchingFeatures,
              })),
            };
          } catch (error) {
            console.error("Error searching cars:", error);
            return { error: errorHandler(error) };
          }
        },
      },
      showRecommendation: {
        description: "Show a specific vehicle recommendation with details",
        parameters: z.object({
          vehicleId: z.string(),
          context: z.string(),
        }),
        execute: async ({ vehicleId }) => {
          try {
            const details = await getCarDetails(vehicleId);
            if (!details) {
              return { error: "Vehicle not found" };
            }
            return {
              car: {
                id: details.vehicleId,
                name: `${details.vehicle.year} ${details.vehicle.make} ${details.vehicle.model}`,
                price: details.vehicle.msrp || 0,
                score: details.totalScore,
                features: details.metadata.matchingFeatures,
              },
            };
          } catch (error) {
            console.error("Error fetching vehicle details:", error);
            return { error: errorHandler(error) };
          }
        },
      },
    },
  });

  return result.toDataStreamResponse({
    getErrorMessage: errorHandler,
  });
}
