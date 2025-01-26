import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { getRecommendations } from "@/app/actions/recommendations";
import { z } from "zod";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4"),
    system: `You are a Toyota vehicle expert AI assistant. Help users find their perfect Toyota vehicle.
    Use the searchCars tool when users ask about specific vehicles or express interest in certain features.
    Always be enthusiastic and knowledgeable about Toyota vehicles.`,
    messages,
    tools: {
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
        }),
        execute: async ({ type, maxPrice, features }) => {
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
            message: `I've found some great Toyota vehicles that match your criteria! Here are the top matches:`,
            cars: matchDescriptions,
          };
        },
      },
    },
  });

  const response = result.toDataStreamResponse();
  response.text().then((text) => {
    try {
      const content = JSON.parse(text) as {
        cars?: Array<{
          id: string;
          name: string;
          price: number;
          score: number;
          features: string[];
        }>;
      };
      if (content.cars) {
        const lastMessage = messages[messages.length - 1] as any; //as Message
        if (lastMessage && lastMessage.role === "assistant") {
          lastMessage.cars = content.cars;
        }
      }
    } catch (e) {
      // Not JSON or no cars, ignore
    }
  });
  return response;
}
