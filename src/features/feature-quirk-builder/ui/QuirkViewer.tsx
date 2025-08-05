import { useState, useEffect } from "react";
import { api } from "convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import type { Id } from "convex/_generated/dataModel";
import { Tile } from "@/components/Tile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PlusIcon } from "lucide-react";
import { QuirkTable } from "./QuirkTable";
import { QuirkProvider, useQuirkContext } from "./QuirkContext";
import type { Quirk } from "../utilities/quirk";

type Props = {
  usernameSlug: string;
  collectionSlug: string;
};

type QuirkViewerHeaderProps = {
  collectionName: string;
  collectionDescription: string;
  onCollectionNameChange: (name: string) => void;
  onCollectionDescriptionChange: (description: string) => void;
  onAddQuirk: () => void;
};

function QuirkViewerHeader({
  collectionName,
  collectionDescription,
  onCollectionNameChange,
  onCollectionDescriptionChange,
  onAddQuirk,
}: QuirkViewerHeaderProps) {
  const { inputText, setInputText } = useQuirkContext();

  return (
    <Tile>
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 md:items-start">
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="collection-name">Collection Name</Label>
              <Input
                id="collection-name"
                value={collectionName}
                onChange={(e) => onCollectionNameChange(e.target.value)}
                placeholder="Enter collection name"
                autoComplete="off"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="collection-description">Description</Label>
              <Textarea
                id="collection-description"
                value={collectionDescription}
                onChange={(e) => onCollectionDescriptionChange(e.target.value)}
                placeholder="Optional description"
                rows={3}
                className="resize-none"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button onClick={onAddQuirk} className="whitespace-nowrap">
            <PlusIcon className="w-4 h-4" />
            Add Quirk
          </Button>
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
  const createQuirk = useMutation(api.quirks.create);
  const reorderQuirk = useMutation(api.quirks.reorder);

  // Local state for the collection being edited
  const [collectionName, setCollectionName] = useState("");
  const [collectionDescription, setCollectionDescription] = useState("");

  // Update local state when data loads
  useEffect(() => {
    if (collectionData) {
      setCollectionName(collectionData.name);
      setCollectionDescription(collectionData.description);
    }
  }, [collectionData]);

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

  const handleAddQuirk = async () => {
    try {
      await createQuirk({
        name: "New Quirk",
        description: "",
        color: "#6366f1", // Default indigo color
        collectionId: collectionData._id,
        attributes: [],
      });
    } catch (error) {
      console.error("Failed to create quirk:", error);
    }
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
          collectionName={collectionName}
          collectionDescription={collectionDescription}
          onCollectionNameChange={setCollectionName}
          onCollectionDescriptionChange={setCollectionDescription}
          onAddQuirk={handleAddQuirk}
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
                <p className="text-sm">Add your first quirk to get started</p>
              </div>
              <Button onClick={handleAddQuirk}>
                <PlusIcon className="w-4 h-4" />
                Add Quirk
              </Button>
            </div>
          </Tile>
        )}
      </div>
    </QuirkProvider>
  );
}
