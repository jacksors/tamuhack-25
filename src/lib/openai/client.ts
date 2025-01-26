import OpenAI from "openai";
import { OpenAIRateLimiter } from "../rate-limit/openai";
import { Resource } from "sst";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

const openai = new OpenAI({
  apiKey: Resource.OPENAI_API_KEY.value,
});

const rateLimiter = OpenAIRateLimiter.getInstance();

export async function createChatCompletion(
  messages: ChatCompletionMessageParam[],
  options: { estimatedTokens?: number; model?: string } = {},
) {
  const estimatedTokens = options.estimatedTokens || 3000; // Default conservative estimate

  // Wait for rate limit capacity
  await rateLimiter.waitForCapacity(estimatedTokens);

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        ...messages,
        {
          role: "system",
          content:
            "Respond with plain JSON only. Do not include markdown formatting, backticks, or any other text. Ensure the JSON is valid and properly escaped.",
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
    });

    // Record actual token usage
    if (completion.usage) {
      await rateLimiter.recordUsage(completion.usage);
    }

    return completion;
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw error;
  }
}
