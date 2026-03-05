import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";

export const anthropic = createAnthropic({
  apiKey: process.env.PROXY_TOKEN!,
  baseURL: process.env.ANTHROPIC_BASE_URL!,
});

export const openai = createOpenAI({
  apiKey: process.env.PROXY_TOKEN!,
  baseURL: process.env.OPENAI_BASE_URL!,
});
