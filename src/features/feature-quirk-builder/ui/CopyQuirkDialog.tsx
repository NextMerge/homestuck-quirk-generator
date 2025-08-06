import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QUIRK_COUNT_MAX } from "convex/limits";
import type { Id } from "convex/_generated/dataModel";
import type { Quirk } from "../utilities/quirk";

type Props = {
  quirk: Quirk | null;
  currentCollectionId: Id<"collections"> | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CopyQuirkDialog({
  quirk,
  currentCollectionId,
  open,
  onOpenChange,
}: Props) {
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const copyQuirk = useMutation(api.quirks.copyToCollection);
  const collections = useQuery(api.collections.getCurrentUserCollections);

  const handleCopy = async () => {
    if (!quirk || !selectedCollectionId) return;

    setIsLoading(true);
    setError(null);

    try {
      await copyQuirk({
        targetCollectionId: selectedCollectionId as Id<"collections">,
        name: quirk.name,
        description: quirk.description,
        color: quirk.color,
        attributes: quirk.attributes,
      });

      // Close dialog on success
      onOpenChange(false);
      setSelectedCollectionId("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to copy quirk");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSelectedCollectionId("");
      setError(null);
    }
    onOpenChange(newOpen);
  };

  // Filter out collections that are at the quirk limit or are the current collection
  const availableCollections =
    collections?.filter(
      (collection) =>
        collection.quirkCount < QUIRK_COUNT_MAX &&
        collection._id !== currentCollectionId,
    ) ?? [];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Copy Quirk to Collection</DialogTitle>
          <DialogDescription>
            Copy "{quirk?.name}" to another collection. The quirk will be
            duplicated with all its attributes.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="collection">Target Collection</Label>
            <Select
              value={selectedCollectionId}
              onValueChange={setSelectedCollectionId}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a collection" />
              </SelectTrigger>
              <SelectContent>
                {availableCollections.length === 0 ? (
                  <div className="p-2 text-sm text-gray-500">
                    No available collections. Collections at the limit (
                    {QUIRK_COUNT_MAX} quirks) are not shown.
                  </div>
                ) : (
                  availableCollections.map((collection) => (
                    <SelectItem key={collection._id} value={collection._id}>
                      <div className="flex justify-between items-center w-full">
                        <span>{collection.name}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          {collection.quirkCount}/{QUIRK_COUNT_MAX}
                        </span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCopy}
            disabled={
              !selectedCollectionId ||
              isLoading ||
              availableCollections.length === 0
            }
          >
            {isLoading ? "Copying..." : "Copy Quirk"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
