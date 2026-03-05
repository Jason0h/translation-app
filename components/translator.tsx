"use client";

import { useRef, useState } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";
import { InputGroupAddon } from "@/components/ui/input-group";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeftRight, Loader2, Upload } from "lucide-react";
import { SiAnthropic, SiOpenai } from "react-icons/si";
import { cn } from "@/lib/utils";
import { LANGUAGES, MODELS, RTL_LANGUAGES } from "@/lib/constants";

export function Translator() {
  const [sourceLang, setSourceLang] = useState("English");
  const [targetLang, setTargetLang] = useState("Spanish");
  const [mode, setMode] = useState<"text" | "json">("text");
  const [model, setModel] = useState("claude-sonnet-4-6");
  const [inputText, setInputText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { output, isLoading, isStale, error, translate } = useTranslation({
    mode,
    sourceLang,
    targetLang,
    model,
    inputText,
  });

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    const text = await file.text();
    try {
      JSON.parse(text);
      setInputText(text);
    } catch {
      // invalid JSON — leave textarea unchanged
    }
  }

  function handleSwap() {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
  }

  function handleSourceLangChange(value: string) {
    if (value === targetLang) setTargetLang(sourceLang);
    setSourceLang(value);
  }

  function handleTargetLangChange(value: string) {
    if (value === sourceLang) setSourceLang(targetLang);
    setTargetLang(value);
  }

  const fontClass = mode === "json" ? "font-mono" : "font-sans";

  return (
    <main className="flex min-h-screen items-start justify-center p-6 pt-12">
      <div className="flex w-full max-w-5xl flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center gap-2">
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

              <input
                type="file"
                accept=".json,application/json"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileUpload}
              />
              <Button
                variant="outline"
                disabled={mode !== "json"}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4" />
                Upload
              </Button>
            </div>

            <LanguageCombobox
              value={sourceLang}
              onLanguageChange={handleSourceLangChange}
            />
          </div>

          <Button variant="outline" size="icon" onClick={handleSwap}>
            <ArrowLeftRight className="h-4 w-4" />
          </Button>

          <div className="flex flex-1 items-center justify-between">
            <LanguageCombobox
              value={targetLang}
              onLanguageChange={handleTargetLangChange}
            />

            <ModelCombobox value={model} onModelChange={setModel} />
          </div>
        </div>

        <div className="relative flex min-h-[300px] items-stretch gap-4">
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                translate();
              }
            }}
            placeholder={
              mode === "json"
                ? `Enter JSON to translate...\n{\n  "key": "value"\n}`
                : "Enter text..."
            }
            dir={RTL_LANGUAGES.has(sourceLang) ? "rtl" : "ltr"}
            className={cn(
              "field-sizing-content max-h-[60vh] flex-1 resize-none overflow-y-auto pb-16 text-sm",
              fontClass,
            )}
          />
          <Textarea
            value={error ?? output}
            readOnly
            placeholder={
              mode === "json"
                ? "Translated JSON will appear here..."
                : "Translated Text will appear here..."
            }
            dir={RTL_LANGUAGES.has(targetLang) ? "rtl" : "ltr"}
            className={cn(
              "field-sizing-fixed flex-1 cursor-default resize-none overflow-y-auto",
              "bg-muted text-sm transition-opacity focus-visible:border-input focus-visible:ring-0",
              fontClass,
              error
                ? "text-destructive"
                : isStale || (isLoading && mode === "json")
                  ? "opacity-40"
                  : "opacity-100",
            )}
          />
          {isLoading && (mode === "json" || !output) && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex w-[calc(50%-0.5rem)] items-center justify-center">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          )}
          <Button
            size="sm"
            onClick={translate}
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

function LanguageCombobox({
  value,
  onLanguageChange,
}: {
  value: string;
  onLanguageChange: (v: string) => void;
}) {
  return (
    <Combobox
      items={LANGUAGES}
      value={value}
      onValueChange={(v) => v && onLanguageChange(v)}
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
  );
}

function ModelCombobox({
  value,
  onModelChange,
}: {
  value: string;
  onModelChange: (v: string) => void;
}) {
  return (
    <Combobox
      items={MODELS.map((m) => m.value)}
      value={value}
      onValueChange={(v) => v && onModelChange(v)}
      itemToStringLabel={(v: string) =>
        MODELS.find((m) => m.value === v)?.label ?? v
      }
    >
      <ComboboxInput className="w-44" placeholder="Model...">
        <InputGroupAddon align="inline-start">
          {MODELS.find((m) => m.value === value)?.provider === "openai" ? (
            <SiOpenai className="size-3.5 shrink-0" />
          ) : (
            <SiAnthropic className="size-3.5 shrink-0" />
          )}
        </InputGroupAddon>
      </ComboboxInput>
      <ComboboxContent>
        <ComboboxEmpty>No model found.</ComboboxEmpty>
        <ComboboxList>
          {(v) => {
            const m = MODELS.find((m) => m.value === v)!;
            return (
              <ComboboxItem key={v} value={v}>
                {m.provider === "openai" ? (
                  <SiOpenai className="size-3.5 shrink-0" />
                ) : (
                  <SiAnthropic className="size-3.5 shrink-0" />
                )}
                {m.label}
              </ComboboxItem>
            );
          }}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
