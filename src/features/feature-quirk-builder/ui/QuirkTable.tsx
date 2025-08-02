import { Tile } from "@/components/Tile";
import { Button } from "@/components/ui/button";
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
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = async (
    text: string,
    index: number,
  ): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => {
        setCopiedIndex(null);
      }, 2000);
    } catch {
      // Failed to copy - silently ignore
    }
  };

  return (
    <Tile className="flex flex-col gap-4 p-6">
      {quirks.map((quirk, index) => {
        const quirkedText = applyQuirk({ quirk, text: inputText });
        return (
          <div key={index} className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full border"
                style={{ backgroundColor: quirk.color }}
              />
              {quirk.name}
            </div>
            <div className="flex-1 font-mono text-sm break-words">
              <span style={{ color: quirk.color }}>{quirkedText}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                void copyToClipboard(quirkedText, index);
              }}
              className="h-8 w-8 p-0"
            >
              {copiedIndex === index ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        );
      })}
    </Tile>
  );
}
