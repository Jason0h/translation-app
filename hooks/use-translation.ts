"use client";

import { useCompletion } from "@ai-sdk/react";
import { useState } from "react";

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
  const {
    completion,
    complete,
    isLoading: textLoading,
    error: textError,
  } = useCompletion({ api: "/api/translate" });

  const [textTranslatedInput, setTextTranslatedInput] = useState("");
  const [textTranslatedTargetLang, setTextTranslatedTargetLang] = useState("");

  const [jsonOutput, setJsonOutput] = useState("");
  const [jsonLoading, setJsonLoading] = useState(false);
  const [jsonTranslatedInput, setJsonTranslatedInput] = useState("");
  const [jsonTranslatedTargetLang, setJsonTranslatedTargetLang] = useState("");
  const [lastAttemptedMode, setLastAttemptedMode] = useState<
    "text" | "json" | null
  >(null);
  const [jsonError, setJsonError] = useState<string | null>(null);

  const isLoading = mode === "json" ? jsonLoading : textLoading;
  const output =
    mode === lastAttemptedMode
      ? mode === "json"
        ? jsonOutput
        : completion
      : "";

  const isStale =
    output !== "" &&
    (mode === "json"
      ? inputText !== jsonTranslatedInput ||
        targetLang !== jsonTranslatedTargetLang
      : inputText !== textTranslatedInput ||
        targetLang !== textTranslatedTargetLang);

  async function translate() {
    if (!inputText.trim()) return;

    if (mode === "json") {
      setLastAttemptedMode("json");
      setJsonError(null);
      setJsonTranslatedInput(inputText);
      setJsonTranslatedTargetLang(targetLang);
      setJsonLoading(true);
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
          setJsonOutput("");
          setJsonError(
            res.status === 400
              ? "Invalid JSON"
              : "Translation failed. Please try again.",
          );
          return;
        }
        const { result } = await res.json();
        setJsonOutput(JSON.stringify(result, null, 2));
      } catch {
        setJsonOutput("");
        setJsonError("Translation failed. Please try again.");
      } finally {
        setJsonLoading(false);
      }
    } else {
      setLastAttemptedMode("text");
      setTextTranslatedInput(inputText);
      setTextTranslatedTargetLang(targetLang);
      complete(inputText, { body: { sourceLang, targetLang, model } });
    }
  }

  const error =
    mode === lastAttemptedMode
      ? mode === "json"
        ? jsonError
        : textError
          ? "Translation failed. Please try again."
          : null
      : null;

  return { output, isLoading, isStale, error, translate };
}
