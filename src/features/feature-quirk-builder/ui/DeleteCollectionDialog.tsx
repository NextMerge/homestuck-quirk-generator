import { useState } from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";

type Props = {
  collectionId: Id<"collections">;
  collectionName: string;
  children?: React.ReactNode;
};

export function DeleteCollectionDialog({
  collectionId,
  collectionName,
  children,
}: Props) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteCollection = useMutation(api.collections.deleteCollection);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteCollection({ collectionId });
      toast.success("Collection deleted successfully!");
      setOpen(false);
    } catch (error) {
      console.error("Failed to delete collection:", error);
      toast.error("Failed to delete collection. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2Icon className="w-4 h-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Collection</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the collection "{collectionName}"?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Collection"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
