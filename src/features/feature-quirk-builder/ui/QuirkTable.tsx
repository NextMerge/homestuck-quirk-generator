import { Tile } from "@/components/Tile";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Authenticated } from "convex/react";
import {
  Check,
  Copy,
  Edit3,
  ChevronUpIcon,
  ChevronDownIcon,
  Copy as CopyIcon,
} from "lucide-react";
import { useState } from "react";
import type { Quirk } from "../utilities/quirk";
import { applyQuirk } from "../utilities/quirk";
import { useQuirkContext } from "./QuirkContext";
import { EditQuirkDialog } from "./EditQuirkDialog";

type QuirkTableProps = {
  quirks: Quirk[];
  editable?: boolean;
  onMoveUp?: (quirkId: string, currentOrder: number) => Promise<void>;
  onMoveDown?: (quirkId: string, currentOrder: number) => Promise<void>;
};

export function QuirkTable({
  quirks,
  editable = false,
  onMoveUp,
  onMoveDown,
}: QuirkTableProps) {
  const { inputText } = useQuirkContext();
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [editingQuirk, setEditingQuirk] = useState<Quirk | null>(null);

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
    <>
      <Tile>
        {quirks.map((quirk, index) => {
          const quirkedText = applyQuirk({ quirk, text: inputText });

          return (
            <div key={quirk.id}>
              <div className="flex items-center gap-8 p-2">
                {/* Reorder controls */}
                {editable && onMoveUp && onMoveDown && (
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                      onClick={() => onMoveUp(quirk.id, index)}
                      disabled={index === 0}
                    >
                      <ChevronUpIcon className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                      onClick={() => onMoveDown(quirk.id, index)}
                      disabled={index === quirks.length - 1}
                    >
                      <ChevronDownIcon className="h-3 w-3" />
                    </Button>
                  </div>
                )}

                {/* Quirk name and color */}
                <div className="flex items-center gap-2 text-sm md:min-w-[130px]">
                  <div
                    className="h-3 w-3 rounded-full border"
                    style={{ backgroundColor: quirk.color }}
                  />
                  <span>{quirk.name}</span>
                </div>

                {/* Quirked text */}
                <div className="flex-1 font-mono">
                  <span
                    className="break-words whitespace-pre-wrap"
                    style={{ color: quirk.color }}
                    suppressHydrationWarning
                  >
                    {quirkedText}
                  </span>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-1">
                  {/* Copy to another collection button - only show when authenticated */}
                  <Authenticated>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // TODO: Implement copy to collection functionality
                        console.log("Copy quirk to collection clicked");
                      }}
                      className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                      title="Copy to another collection"
                    >
                      <CopyIcon className="h-4 w-4" />
                    </Button>
                  </Authenticated>

                  {/* Edit button - only show when editable */}
                  {editable && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingQuirk(quirk)}
                      className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                      title="Edit quirk"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  )}

                  {/* Copy button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      void copyToClipboard(quirkedText, quirk.id);
                    }}
                    className="h-8 w-8 p-0"
                    title="Copy quirked text"
                  >
                    {copiedIndex === quirk.id ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              {index < quirks.length - 1 && (
                <Separator orientation="horizontal" />
              )}
            </div>
          );
        })}
      </Tile>

      {/* Edit Quirk Dialog */}
      {editingQuirk && (
        <EditQuirkDialog
          quirk={editingQuirk}
          open={!!editingQuirk}
          onOpenChange={(open) => {
            if (!open) setEditingQuirk(null);
          }}
        />
      )}
    </>
  );
}
