"use client";

import { useCompletion } from "@ai-sdk/react";
import { useState } from "react";

interface UseTextTranslationOptions {
  sourceLang: string;
  targetLang: string;
  model: string;
  inputText: string;
}

export function useTextTranslation({
  sourceLang,
  targetLang,
  model,
  inputText,
}: UseTextTranslationOptions) {
  const {
    completion,
    complete,
    isLoading,
    error: completionError,
  } = useCompletion({ api: "/api/translate" });

  // tracks what was last submitted, used to derive isStale
  const [translatedInput, setTranslatedInput] = useState("");
  const [translatedTargetLang, setTranslatedTargetLang] = useState("");

  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [detectedInput, setDetectedInput] = useState<string | null>(null);

  const isStale =
    completion !== "" &&
    (inputText !== translatedInput || targetLang !== translatedTargetLang);

  const error = completionError
    ? "Translation failed. Please try again."
    : null;

  async function translate() {
    setTranslatedInput(inputText);
    setTranslatedTargetLang(targetLang);
    // capture at call time to avoid stale closure in the async detect call
    const capturedInput = inputText;
    complete(inputText, { body: { sourceLang, targetLang, model } }).then(
      async () => {
        const res = await fetch("/api/detect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: capturedInput }),
        });
        if (res.ok) {
          const { language } = await res.json();
          setDetectedLanguage(language ?? null);
          setDetectedInput(capturedInput);
        }
      },
    );
  }

  return {
    output: completion,
    isLoading,
    isStale,
    error,
    detectedLanguage: inputText === detectedInput ? detectedLanguage : null,
    translate,
  };
}
