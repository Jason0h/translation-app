"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeftRight } from "lucide-react";

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
];

const MODELS = [
  { value: "claude-haiku-4-5-20251001", label: "Haiku" },
  { value: "claude-sonnet-4-6", label: "Sonnet" },
  { value: "claude-opus-4-6", label: "Opus" },
];

export function Translator() {
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("es");
  const [mode, setMode] = useState<"text" | "json">("text");
  const [model, setModel] = useState("claude-sonnet-4-6");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");

  function handleTranslate() {
    // TODO: call API
  }

  function handleSwap() {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInputText(outputText);
    setOutputText("");
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

            <Select value={sourceLang} onValueChange={handleSourceLangChange}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" size="icon" onClick={handleSwap}>
            <ArrowLeftRight className="h-4 w-4" />
          </Button>

          <div className="flex flex-1 items-center justify-between">
            <Select value={targetLang} onValueChange={handleTargetLangChange}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MODELS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="relative flex max-h-[60vh] min-h-[300px] items-stretch gap-4 overflow-y-auto">
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
            className="field-sizing-content flex-1 resize-none pb-16 font-mono text-sm"
          />
          <Textarea
            value={outputText}
            readOnly
            placeholder={outputPlaceholder}
            className="field-sizing-fixed flex-1 cursor-default resize-none bg-muted font-mono text-sm focus-visible:border-input focus-visible:ring-0"
          />
          <Button
            size="sm"
            onClick={handleTranslate}
            className="absolute right-[calc(50%+1.25rem)] bottom-3"
          >
            Translate
          </Button>
        </div>
      </div>
    </main>
  );
}
