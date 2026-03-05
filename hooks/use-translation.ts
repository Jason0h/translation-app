"use client";

import { useState } from "react";
import { useTextTranslation } from "./use-text-translation";
import { useJsonTranslation } from "./use-json-translation";

interface UseTranslationOptions {
  mode: "text" | "json";
  sourceLang: string;
  targetLang: string;
  model: string;
  inputText: string;
}

export function useTranslation({
  mode,
  sourceLang,
  targetLang,
  model,
  inputText,
}: UseTranslationOptions) {
  const text = useTextTranslation({ sourceLang, targetLang, model, inputText });
  const json = useJsonTranslation({ sourceLang, targetLang, model, inputText });

  // gates output/error/detection visibility — only show results from the last attempted mode
  const [lastAttemptedMode, setLastAttemptedMode] = useState<
    "text" | "json" | null
  >(null);

  const active = mode === "json" ? json : text;
  const lastActive = lastAttemptedMode === "json" ? json : text;

  function translate() {
    if (!inputText.trim()) return;
    setLastAttemptedMode(mode);
    active.translate();
  }

  const onLastAttemptedMode = mode === lastAttemptedMode;

  return {
    output: onLastAttemptedMode ? active.output : "",
    isLoading: active.isLoading,
    isStale: onLastAttemptedMode && active.isStale,
    error: onLastAttemptedMode ? active.error : null,
    detectedLanguage: lastActive.detectedLanguage,
    translate,
  };
}
