"use client";

import { useState } from "react";

interface UseJsonTranslationOptions {
  sourceLang: string;
  targetLang: string;
  model: string;
  inputText: string;
}

export function useJsonTranslation({
  sourceLang,
  targetLang,
  model,
  inputText,
}: UseJsonTranslationOptions) {
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // tracks what was last submitted, used to derive isStale
  const [translatedInput, setTranslatedInput] = useState("");
  const [translatedTargetLang, setTranslatedTargetLang] = useState("");

  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [detectedInput, setDetectedInput] = useState<string | null>(null);

  const isStale =
    output !== "" &&
    (inputText !== translatedInput || targetLang !== translatedTargetLang);

  async function translate() {
    setError(null);
    setTranslatedInput(inputText);
    setTranslatedTargetLang(targetLang);
    setIsLoading(true);
    try {
      const res = await fetch("/api/translate/json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: inputText,
          sourceLang,
          targetLang,
          model,
        }),
      });
      if (!res.ok) {
        setOutput("");
        setError(
          res.status === 400
            ? "Invalid JSON"
            : "Translation failed. Please try again.",
        );
        return;
      }
      const { result, detectedLanguage: detected } = await res.json();
      setOutput(JSON.stringify(result, null, 2));
      setDetectedLanguage(detected ?? null);
      setDetectedInput(inputText);
    } catch {
      setOutput("");
      setError("Translation failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return {
    output: isLoading ? "" : output,
    isLoading,
    isStale,
    error,
    detectedLanguage: inputText === detectedInput ? detectedLanguage : null,
    translate,
  };
}
