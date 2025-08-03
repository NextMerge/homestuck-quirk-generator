import { Tile } from "@/components/Tile";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import type { Quirk } from "../utilities/quirk";
import { applyQuirk } from "../utilities/quirk";
import { useQuirkContext } from "./QuirkContext";

type QuirkTableProps = {
  quirks: Quirk[];
};

export function QuirkTable({ quirks }: QuirkTableProps) {
  const { inputText } = useQuirkContext();
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(id);
      setTimeout(() => {
        setCopiedIndex(null);
      }, 2000);
    } catch {
      // Failed to copy - silently ignore
    }
  };

  return (
    <Tile className="flex flex-col gap-6 p-6">
      {quirks.map((quirk, index) => {
        const quirkedText = applyQuirk({ quirk, text: inputText });
        return (
          <div key={quirk.id}>
            <div className="flex items-center gap-8 p-2">
              <div className="flex items-center gap-2 text-sm md:min-w-[130px]">
                <div
                  className="h-3 w-3 rounded-full border"
                  style={{ backgroundColor: quirk.color }}
                />
                {quirk.name}
              </div>
              <div className="flex-1 font-mono break-words">
                <span
                  className="whitespace-pre-wrap"
                  style={{ color: quirk.color }}
                  suppressHydrationWarning
                >
                  {quirkedText}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  void copyToClipboard(quirkedText, quirk.id);
                }}
                className="h-8 w-8 p-0"
              >
                {copiedIndex === quirk.id ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            {index < quirks.length - 1 && (
              <Separator orientation="horizontal" />
            )}
          </div>
        );
      })}
    </Tile>
  );
}
