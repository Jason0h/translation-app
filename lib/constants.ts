export const LANGUAGES = [
  "English",
  "Mandarin",
  "Hindi",
  "Spanish",
  "Arabic",
  "French",
  "Bengali",
  "Portuguese",
  "Russian",
  "Indonesian",
  "Urdu",
  "German",
  "Japanese",
  "Marathi",
  "Vietnamese",
  "Telugu",
  "Turkish",
  "Swahili",
  "Tagalog",
  "Tamil",
  "Persian",
  "Korean",
  "Thai",
  "Italian",
  "Gujarati",
  "Amharic",
  "Kannada",
];

export const RTL_LANGUAGES = new Set(["Arabic", "Urdu", "Persian"]);

export const MODELS = [
  {
    value: "claude-haiku-4-5-20251001",
    label: "Haiku 4.5",
    provider: "anthropic",
  },
  { value: "claude-sonnet-4-6", label: "Sonnet 4.6", provider: "anthropic" },
  { value: "claude-opus-4-6", label: "Opus 4.6", provider: "anthropic" },
  { value: "gpt-5-nano-2025-08-07", label: "GPT-5 Nano", provider: "openai" },
  { value: "gpt-5-mini-2025-08-07", label: "GPT-5 Mini", provider: "openai" },
  { value: "gpt-5.2-2025-12-11", label: "GPT-5.2", provider: "openai" },
];
