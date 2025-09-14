import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { api } from "convex/_generated/api";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusIcon } from "lucide-react";
import { COLLECTION_COUNT_MAX, NAME_MAX_LENGTH } from "convex/limits";
import { convertToSlug } from "@/lib/slugify";

type Props = {
  existingCollectionNames: string[];
};

export function CreateCollectionDialog({ existingCollectionNames }: Props) {
  const [open, setOpen] = useState(false);
  const createCollection = useMutation(api.collections.create);

  const form = useForm({
    defaultValues: {
      collectionName: "",
      description: "",
    },
    onSubmit: async ({ value }) => {
      try {
        await createCollection({
          name: value.collectionName,
          description: value.description,
        });
        toast.success("Collection created successfully!");
        setOpen(false);
        form.reset();
      } catch (error) {
        console.error("Failed to create collection:", error);
        toast.error("Failed to create collection. Please try again.");
      }
    },
  });

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {existingCollectionNames.length <= COLLECTION_COUNT_MAX ? (
          <Button variant="outline">
            <PlusIcon className="w-4 h-4" />
            New Collection
          </Button>
        ) : (
          <Button variant="outline" disabled className="cursor-not-allowed">
            <PlusIcon className="w-4 h-4" />
            You have reached the maximum number of collections
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <DialogHeader>
            <DialogTitle>Create New Collection</DialogTitle>
            <DialogDescription>
              Create a new quirk collection. Choose a unique name and optionally
              add a description.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <form.Field
              name="collectionName"
              validators={{
                onChange: ({ value }) => {
                  if (!value || value.trim() === "") {
                    return "Collection name is required";
                  }
                  if (value.trim().length < 2) {
                    return "Collection name must be at least 2 characters";
                  }
                  if (value.trim().length > NAME_MAX_LENGTH) {
                    return `Collection name must be ${NAME_MAX_LENGTH} characters or less`;
                  }
                  // Check if name already exists (case-insensitive)
                  const normalizedValue = value.trim().toLowerCase();
                  const nameExists = existingCollectionNames.some(
                    (name) => name.toLowerCase() === normalizedValue,
                  );

                  const slugName = convertToSlug(value);
                  const slugNameExists = existingCollectionNames.some(
                    (name) => convertToSlug(name) === slugName,
                  );

                  if (nameExists || slugNameExists) {
                    return "A collection with this name already exists";
                  }

                  return undefined;
                },
              }}
            >
              {(field) => (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor={field.name} className="text-right">
                    Name*
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter collection name"
                      className={
                        field.state.meta.errors.length > 0
                          ? "border-red-500"
                          : ""
                      }
                      autoComplete="off"
                      data-1p-ignore
                    />
                    {field.state.meta.errors.length > 0 && (
                      <div className="text-red-500 text-sm mt-1">
                        {field.state.meta.errors[0]}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </form.Field>
            <form.Field
              name="description"
              validators={{
                onChange: ({ value }) => {
                  if (value && value.length > 200) {
                    return "Description must be 200 characters or less";
                  }
                  return undefined;
                },
              }}
            >
              {(field) => (
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor={field.name} className="text-right pt-2">
                    Description
                  </Label>
                  <div className="col-span-3">
                    <Textarea
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Optional description"
                      className={
                        field.state.meta.errors.length > 0
                          ? "border-red-500"
                          : ""
                      }
                      rows={3}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <div className="text-red-500 text-sm mt-1">
                        {field.state.meta.errors[0]}
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      {field.state.value.length}/200 characters
                    </div>
                  </div>
                </div>
              )}
            </form.Field>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit || isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Collection"}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
