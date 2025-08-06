import { useState } from "react";
import { api } from "convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import type { Id } from "convex/_generated/dataModel";
import { Tile } from "@/components/Tile";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PlusIcon } from "lucide-react";
import { QuirkTable } from "./QuirkTable";
import { QuirkProvider, useQuirkContext } from "./QuirkContext";
import CreateQuirkDialog from "./CreateQuirkDialog";
import type { Quirk } from "../utilities/quirk";

type Props = {
  usernameSlug: string;
  collectionSlug: string;
};

type QuirkViewerHeaderProps = {
  collectionName: string;
  collectionDescription: string;
  onAddQuirk: () => void;
  isOwner: boolean;
};

function QuirkViewerHeader({
  collectionName,
  collectionDescription,
  onAddQuirk,
  isOwner,
}: QuirkViewerHeaderProps) {
  const { inputText, setInputText } = useQuirkContext();

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

        {/* Test Text Input and Add Quirk Button */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 md:items-start">
          <div className="flex-1 space-y-2">
            <Label htmlFor="input-text">Test Text</Label>
            <Textarea
              id="input-text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to test quirks"
              rows={3}
              className="resize-none font-mono"
            />
          </div>
          {isOwner && (
            <div className="flex flex-col gap-2">
              <Button onClick={onAddQuirk} className="whitespace-nowrap">
                <PlusIcon className="w-4 h-4" />
                Add Quirk
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
        />
        {quirks.length > 0 ? (
          <QuirkTable
            quirks={quirks}
            editable={collectionData.collectionBelongsToUser}
            onMoveUp={handleMoveQuirkUp}
            onMoveDown={handleMoveQuirkDown}
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
                <Button onClick={handleAddQuirk}>
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
