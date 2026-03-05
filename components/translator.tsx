"use client";

import { useCompletion } from "@ai-sdk/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeftRight } from "lucide-react";
import { LANGUAGES, MODELS } from "@/lib/constants";

export function Translator() {
  const [sourceLang, setSourceLang] = useState("English");
  const [targetLang, setTargetLang] = useState("Spanish");
  const [mode, setMode] = useState<"text" | "json">("text");
  const [model, setModel] = useState("claude-sonnet-4-6");
  const [inputText, setInputText] = useState("");
  const [translatedInput, setTranslatedInput] = useState("");

  const { completion, complete, isLoading } = useCompletion({
    api: "/api/translate",
  });

  const isStale = completion !== "" && inputText !== translatedInput;

  function handleTranslate() {
    if (!inputText.trim()) return;
    setTranslatedInput(inputText);
    complete(inputText, {
      body: { sourceLang, targetLang, model },
    });
  }

  function handleSwap() {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
  }

  function handleSourceLangChange(value: string) {
    if (value === targetLang) {
      setTargetLang(sourceLang);
    }
    setSourceLang(value);
  }

  function handleTargetLangChange(value: string) {
    if (value === sourceLang) {
      setSourceLang(targetLang);
    }
    setTargetLang(value);
  }

  const inputPlaceholder =
    mode === "json"
      ? `Enter JSON to translate...\n{\n  "key": "value"\n}`
      : "Enter text...";

  const outputPlaceholder =
    mode === "json"
      ? "Translated JSON will appear here..."
      : "Translation will appear here...";

  return (
    <main className="flex min-h-screen items-start justify-center p-6 pt-12">
      <div className="flex w-full max-w-5xl flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center overflow-hidden rounded-md border">
              <Button
                variant={mode === "text" ? "default" : "ghost"}
                className="rounded-none"
                onClick={() => setMode("text")}
              >
                Text
              </Button>
              <Button
                variant={mode === "json" ? "default" : "ghost"}
                className="rounded-none border-l"
                onClick={() => setMode("json")}
              >
                JSON
              </Button>
            </div>

            <Combobox
              items={LANGUAGES}
              value={sourceLang}
              onValueChange={(v) => v && handleSourceLangChange(v)}
            >
              <ComboboxInput className="w-36" placeholder="Language..." />
              <ComboboxContent>
                <ComboboxEmpty>No language found.</ComboboxEmpty>
                <ComboboxList>
                  {(lang) => (
                    <ComboboxItem key={lang} value={lang}>
                      {lang}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>

          <Button variant="outline" size="icon" onClick={handleSwap}>
            <ArrowLeftRight className="h-4 w-4" />
          </Button>

          <div className="flex flex-1 items-center justify-between">
            <Combobox
              items={LANGUAGES}
              value={targetLang}
              onValueChange={(v) => v && handleTargetLangChange(v)}
            >
              <ComboboxInput className="w-36" placeholder="Language..." />
              <ComboboxContent>
                <ComboboxEmpty>No language found.</ComboboxEmpty>
                <ComboboxList>
                  {(lang) => (
                    <ComboboxItem key={lang} value={lang}>
                      {lang}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>

            <Combobox
              items={MODELS.map((m) => m.value)}
              value={model}
              onValueChange={(v) => v && setModel(v)}
              itemToStringLabel={(v: string) =>
                MODELS.find((m) => m.value === v)?.label ?? v
              }
            >
              <ComboboxInput className="w-36" placeholder="Model..." />
              <ComboboxContent>
                <ComboboxEmpty>No model found.</ComboboxEmpty>
                <ComboboxList>
                  {(v) => (
                    <ComboboxItem key={v} value={v}>
                      {MODELS.find((m) => m.value === v)?.label}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>
        </div>

        <div className="relative flex min-h-[300px] items-stretch gap-4">
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleTranslate();
              }
            }}
            placeholder={inputPlaceholder}
            className="field-sizing-content max-h-[60vh] flex-1 resize-none overflow-y-auto pb-16 font-mono text-sm"
          />
          <Textarea
            value={completion}
            readOnly
            placeholder={outputPlaceholder}
            className={`field-sizing-fixed flex-1 cursor-default resize-none overflow-y-auto bg-muted font-mono text-sm transition-opacity focus-visible:border-input focus-visible:ring-0 ${isStale ? "opacity-40" : "opacity-100"}`}
          />
          <Button
            size="sm"
            onClick={handleTranslate}
            disabled={isLoading}
            className="absolute right-[calc(50%+1.25rem)] bottom-3"
          >
            Translate
          </Button>
        </div>
      </div>
    </main>
  );
}
