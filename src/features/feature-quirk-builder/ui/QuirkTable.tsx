import { Tile } from "@/components/Tile";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Authenticated } from "convex/react";
import {
  Check,
  Copy,
  Edit3,
  ChevronUpIcon,
  ChevronDownIcon,
  FolderPlus,
  Pin,
  PinOff,
} from "lucide-react";
import { useState, useMemo } from "react";
import type { Quirk } from "../utilities/quirk";
import { applyQuirk } from "../utilities/quirk";
import { useQuirkContext } from "./QuirkContext";
import { EditQuirkDialog } from "./EditQuirkDialog";
import { CopyQuirkDialog } from "./CopyQuirkDialog";
import { usePinnedQuirks } from "@/hooks/usePinnedQuirks";
import type { Id } from "convex/_generated/dataModel";

type QuirkTableProps = {
  quirks: Quirk[];
  editable?: boolean;
  onMoveUp?: (quirkId: string, currentOrder: number) => Promise<void>;
  onMoveDown?: (quirkId: string, currentOrder: number) => Promise<void>;
  pinKey: string;
  currentCollectionId?: Id<"collections">;
};

export function QuirkTable({
  quirks,
  editable = false,
  onMoveUp,
  onMoveDown,
  pinKey,
  currentCollectionId,
}: QuirkTableProps) {
  const { inputText } = useQuirkContext();
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [editingQuirk, setEditingQuirk] = useState<Quirk | null>(null);
  const [copyingQuirk, setCopyingQuirk] = useState<Quirk | null>(null);
  const { isPinned, togglePin, pinnedQuirkIds } = usePinnedQuirks(pinKey);

  // Separate pinned and unpinned quirks, maintaining pinning order
  const { pinnedQuirks, unpinnedQuirks } = useMemo(() => {
    const unpinned: Quirk[] = [];

    // Create a map for quick quirk lookup
    const quirkMap = new Map(quirks.map((quirk) => [quirk.id, quirk]));

    // Build pinned quirks array in the order they were pinned
    const pinned: Quirk[] = pinnedQuirkIds
      .map((id) => quirkMap.get(id))
      .filter((quirk): quirk is Quirk => quirk !== undefined);

    // Build unpinned quirks array
    quirks.forEach((quirk) => {
      if (!isPinned(quirk.id)) {
        unpinned.push(quirk);
      }
    });

    return { pinnedQuirks: pinned, unpinnedQuirks: unpinned };
  }, [quirks, pinnedQuirkIds, isPinned]);

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

  const renderQuirkRow = (
    quirk: Quirk,
    index: number,
    isInPinnedSection: boolean,
  ) => {
    const quirkedText = applyQuirk({ quirk, text: inputText });

    return (
      <div key={quirk.id}>
        <div className="flex items-center gap-8 p-2">
          {/* Reorder controls */}
          {editable && onMoveUp && onMoveDown && !isInPinnedSection && (
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
                disabled={index === unpinnedQuirks.length - 1}
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
            {quirk.description ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-help underline decoration-dotted">
                    {quirk.name}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{quirk.description}</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <span>{quirk.name}</span>
            )}
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
            {/* Pin button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => togglePin(quirk.id)}
              className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
              title={isPinned(quirk.id) ? "Unpin quirk" : "Pin quirk"}
            >
              {isPinned(quirk.id) ? (
                <PinOff className="h-4 w-4" />
              ) : (
                <Pin className="h-4 w-4" />
              )}
            </Button>

            {/* Copy to another collection button - only show when authenticated */}
            <Authenticated>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCopyingQuirk(quirk)}
                className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                title="Copy to another collection"
              >
                <FolderPlus className="h-4 w-4" />
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
      </div>
    );
  };

  return (
    <>
      {/* Pinned quirks section */}
      {pinnedQuirks.length > 0 && (
        <Tile>
          {pinnedQuirks.map((quirk, index) => (
            <div key={quirk.id}>
              {renderQuirkRow(quirk, index, true)}
              {index < pinnedQuirks.length - 1 && (
                <Separator orientation="horizontal" />
              )}
            </div>
          ))}
        </Tile>
      )}

      {/* Gap between pinned and unpinned quirks */}
      {pinnedQuirks.length > 0 && unpinnedQuirks.length > 0 && (
        <div className="h-4" />
      )}

      {/* Unpinned quirks section */}
      {unpinnedQuirks.length > 0 && (
        <Tile>
          {unpinnedQuirks.map((quirk, index) => (
            <div key={quirk.id}>
              {renderQuirkRow(quirk, index, false)}
              {index < unpinnedQuirks.length - 1 && (
                <Separator orientation="horizontal" />
              )}
            </div>
          ))}
        </Tile>
      )}

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

      {/* Copy Quirk Dialog */}
      <CopyQuirkDialog
        quirk={copyingQuirk}
        currentCollectionId={currentCollectionId || null}
        open={!!copyingQuirk}
        onOpenChange={(open) => {
          if (!open) setCopyingQuirk(null);
        }}
      />
    </>
  );
}
