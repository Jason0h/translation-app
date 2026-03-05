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
  } = useCompletion({ api: "/api/translate" });

  const [textTranslatedInput, setTextTranslatedInput] = useState("");
  const [textTranslatedTargetLang, setTextTranslatedTargetLang] = useState("");

  const [jsonOutput, setJsonOutput] = useState("");
  const [jsonLoading, setJsonLoading] = useState(false);
  const [jsonTranslatedInput, setJsonTranslatedInput] = useState("");
  const [jsonTranslatedTargetLang, setJsonTranslatedTargetLang] = useState("");
  const [lastTranslatedMode, setLastTranslatedMode] = useState<
    "text" | "json" | null
  >(null);

  const isLoading = mode === "json" ? jsonLoading : textLoading;
  const output =
    mode === lastTranslatedMode
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
        if (!res.ok) throw new Error(await res.text());
        const { result } = await res.json();
        setJsonOutput(JSON.stringify(result, null, 2));
        setLastTranslatedMode("json");
      } catch {
        // TODO: handle errors
      } finally {
        setJsonLoading(false);
      }
    } else {
      setTextTranslatedInput(inputText);
      setTextTranslatedTargetLang(targetLang);
      setLastTranslatedMode("text");
      complete(inputText, { body: { sourceLang, targetLang, model } });
    }
  }

  return { output, isLoading, isStale, translate };
}
