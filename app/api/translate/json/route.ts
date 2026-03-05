import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText, Output } from "ai";
import { z } from "zod";
import { LANGUAGES, MODELS } from "@/lib/constants";
import { extractStrings, reconstruct } from "@/lib/json-utils";

const anthropic = createAnthropic({
  apiKey: process.env.PROXY_TOKEN!,
  baseURL: process.env.ANTHROPIC_BASE_URL!,
});

const openai = createOpenAI({
  apiKey: process.env.PROXY_TOKEN!,
  baseURL: process.env.OPENAI_BASE_URL!,
});

const ALLOWED_LANGS = LANGUAGES;
const ALLOWED_MODELS = MODELS.map((m) => m.value);

export async function POST(req: Request) {
  const { prompt, sourceLang, targetLang, model } = await req.json();

  if (
    !ALLOWED_LANGS.includes(sourceLang) ||
    !ALLOWED_LANGS.includes(targetLang)
  ) {
    return new Response("Invalid language", { status: 400 });
  }
  if (!ALLOWED_MODELS.includes(model)) {
    return new Response("Invalid model", { status: 400 });
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(prompt);
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const strings = extractStrings(parsed);

  if (strings.length === 0) {
    return Response.json({ result: parsed });
  }

  const provider = MODELS.find((m) => m.value === model)!.provider;
  const languageModel =
    provider === "openai" ? openai(model) : anthropic(model);

  const { output } = await generateText({
    model: languageModel,
    output: Output.object({
      schema: z.object({ translations: z.array(z.string()) }),
    }),
    system: `You are a translation engine. Translate from ${sourceLang} to ${targetLang}. Return only translations, preserving order exactly.`,
    prompt: `Translate these strings:\n${JSON.stringify(strings)}`,
  });

  const translations = (output as { translations: string[] }).translations;
  const result = reconstruct(parsed, translations, { value: 0 });

  return Response.json({ result });
}
