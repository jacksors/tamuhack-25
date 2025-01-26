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

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: `You are a friendly and knowledgeable Toyota vehicle expert AI assistant. 
    Your goal is to help users find their perfect Toyota vehicle through natural conversation.
    
    Guidelines:
    - Be conversational and friendly, but professional
    - Ask follow-up questions to better understand the user's needs
    - Use viewPreferences to understand the user's saved preferences
    - Use searchCars when searching for matches based on criteria
    - Use showRecommendation when you want to highlight a specific vehicle
    - Explain why you're recommending certain vehicles based on the specific conversation context
    - Focus on understanding their lifestyle, budget, and must-have features
    - If they mention specific requirements, acknowledge them and use them in your search
    - Don't overwhelm them with too many options at once
    - Be enthusiastic about Toyota vehicles while remaining honest and helpful
    - Construct natural responses that flow with the conversation
    
    Example conversation flow:
    1. Check existing preferences with viewPreferences
    2. Understand any new needs through conversation
    3. Use searchCars to find matches when appropriate
    4. Use showRecommendation to highlight specific matches
    5. Be ready to refine suggestions based on their feedback`,
    messages,
    tools: {
      viewPreferences: {
        description: "View the user's saved vehicle preferences",
        parameters: z.object({}),
        execute: async () => {
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
        },
      },
      searchCars: {
        description:
          "Search for Toyota vehicles based on criteria and return matching cars",
        parameters: z.object({
          type: z
            .string()
            .optional()
            .describe("The type of vehicle (e.g., SUV, Sedan, Truck)"),
          maxPrice: z.number().optional().describe("Maximum price in USD"),
          features: z
            .array(z.string())
            .optional()
            .describe("Desired features (e.g., AWD, Hybrid, Third Row)"),
          context: z
            .string()
            .describe(
              "The conversation context to help form a natural response",
            ),
        }),
        execute: async ({ type, maxPrice, features, context }) => {
          const recommendations = await getRecommendations();

          // Filter recommendations based on criteria
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

          // Get the top 3 matches
          const topMatches = matches.slice(0, 3);

          // Format the response
          const matchDescriptions = topMatches.map((match) => {
            const vehicle = match.vehicle;
            return {
              name: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
              price: vehicle.msrp,
              score: match.totalScore,
              features: match.metadata.matchingFeatures,
              id: match.vehicleId,
            };
          });

          return {
            cars: matchDescriptions,
          };
        },
      },
      showRecommendation: {
        description: "Show a specific vehicle recommendation with details",
        parameters: z.object({
          vehicleId: z.string().describe("The ID of the vehicle to show"),
          context: z.string().describe("Why this vehicle is being recommended"),
        }),
        execute: async ({ vehicleId, context }) => {
          const details = await getCarDetails(vehicleId);

          if (!details) {
            return {
              error: "Vehicle not found",
            };
          }

          return {
            cars: [
              {
                id: details.vehicleId,
                name: `${details.vehicle.year} ${details.vehicle.make} ${details.vehicle.model}`,
                price: details.vehicle.msrp,
                score: details.totalScore,
                features: details.metadata.matchingFeatures,
              },
            ],
            context,
          };
        },
      },
    },
  });

  return result.toDataStreamResponse();
}
