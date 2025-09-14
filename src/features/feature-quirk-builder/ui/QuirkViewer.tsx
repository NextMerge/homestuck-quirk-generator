import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { QUIRK_COUNT_MAX } from "convex/limits";
import { useMutation, useQuery } from "convex/react";
import { PlusIcon } from "lucide-react";
import { useId, useState } from "react";
import { Tile } from "@/components/Tile";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Quirk } from "../utilities/quirk";
import CreateQuirkDialog from "./CreateQuirkDialog";
import { phrase, QuirkProvider, useQuirkContext } from "./QuirkContext";
import { QuirkTable } from "./QuirkTable";

type Props = {
  usernameSlug: string;
  collectionSlug: string;
};

type QuirkViewerHeaderProps = {
  collectionName: string;
  collectionDescription: string;
  onAddQuirk: () => void;
  isOwner: boolean;
  quirkCount: number;
};

function QuirkViewerHeader({
  collectionName,
  collectionDescription,
  onAddQuirk,
  isOwner,
  quirkCount,
}: QuirkViewerHeaderProps) {
  const { inputText, setInputText } = useQuirkContext();
  const inputTextFieldId = useId();

  return (
    <Tile>
      <div className="space-y-4">
        {/* Collection Name and Description - Always Read-Only */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{collectionName}</h1>
          {collectionDescription && (
            <p className="text-gray-600">{collectionDescription}</p>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:gap-6 md:items-start">
          <div className="flex-1 space-y-2">
            <Label htmlFor={inputTextFieldId}>Input Text</Label>
            <Textarea
              id={inputTextFieldId}
              value={inputText}
              onFocus={() => {
                if (inputText === phrase && !isOwner) {
                  setInputText("");
                }
              }}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to test quirks"
              rows={3}
              className="resize-none font-mono"
            />
          </div>
          {isOwner && (
            <div className="flex flex-col gap-2">
              <Button
                onClick={onAddQuirk}
                className="whitespace-nowrap"
                disabled={quirkCount >= QUIRK_COUNT_MAX}
                title={
                  quirkCount >= QUIRK_COUNT_MAX
                    ? `Maximum ${QUIRK_COUNT_MAX} quirks per collection`
                    : "Add a new quirk"
                }
              >
                <PlusIcon className="w-4 h-4" />
                Add Quirk
                {quirkCount >= QUIRK_COUNT_MAX && (
                  <span className="text-xs text-gray-500">
                    (Maximum {QUIRK_COUNT_MAX} quirks per collection)
                  </span>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </Tile>
  );
}

export function QuirkViewer({ usernameSlug, collectionSlug }: Props) {
  // Get collection data from Convex
  const collectionData = useQuery(api.collections.get, {
    usernameSlug,
    collectionSlug,
  });

  // Mutations
  const reorderQuirk = useMutation(api.quirks.reorder);

  // Local state
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  if (collectionData === undefined) {
    return <div>Loading...</div>;
  }

  if (collectionData === null) {
    return <div>Collection not found</div>;
  }

  // Convert quirks to the format expected by QuirkTable
  const quirks: Quirk[] = collectionData.quirks.map((quirk) => ({
    id: quirk._id,
    name: quirk.name,
    description: quirk.description,
    color: quirk.color,
    attributes: quirk.attributes,
  }));

  const handleAddQuirk = () => {
    setShowCreateDialog(true);
  };

  const handleMoveQuirkUp = async (quirkId: string, currentOrder: number) => {
    if (currentOrder > 0) {
      try {
        await reorderQuirk({
          quirkId: quirkId as Id<"quirks">,
          newOrder: currentOrder - 1,
        });
      } catch (error) {
        console.error("Failed to move quirk up:", error);
      }
    }
  };

  const handleMoveQuirkDown = async (quirkId: string, currentOrder: number) => {
    if (currentOrder < quirks.length - 1) {
      try {
        await reorderQuirk({
          quirkId: quirkId as Id<"quirks">,
          newOrder: currentOrder + 1,
        });
      } catch (error) {
        console.error("Failed to move quirk down:", error);
      }
    }
  };

  return (
    <QuirkProvider>
      <div className="space-y-6">
        <QuirkViewerHeader
          collectionName={collectionData.name}
          collectionDescription={collectionData.description}
          onAddQuirk={handleAddQuirk}
          isOwner={collectionData.collectionBelongsToUser}
          quirkCount={quirks.length}
        />
        {quirks.length > 0 ? (
          <QuirkTable
            quirks={quirks}
            editable={collectionData.collectionBelongsToUser}
            onMoveUp={handleMoveQuirkUp}
            onMoveDown={handleMoveQuirkDown}
            pinKey={`${usernameSlug}-${collectionSlug}`}
            currentCollectionId={collectionData._id}
          />
        ) : (
          <Tile>
            <div className="flex flex-col items-center justify-center text-center">
              <div className="text-gray-500 mb-4">
                <PlusIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-lg font-medium">No quirks yet</p>
                <p className="text-sm">
                  {collectionData.collectionBelongsToUser
                    ? "Add your first quirk to get started"
                    : "This collection is empty"}
                </p>
              </div>
              {collectionData.collectionBelongsToUser && (
                <Button
                  onClick={handleAddQuirk}
                  disabled={quirks.length >= QUIRK_COUNT_MAX}
                  title={
                    quirks.length >= QUIRK_COUNT_MAX
                      ? `Maximum ${QUIRK_COUNT_MAX} quirks per collection`
                      : "Add your first quirk"
                  }
                >
                  <PlusIcon className="w-4 h-4" />
                  Add Quirk
                </Button>
              )}
            </div>
          </Tile>
        )}

        <CreateQuirkDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          collectionId={collectionData._id}
          existingQuirks={collectionData.quirks}
        />
      </div>
    </QuirkProvider>
  );
}
