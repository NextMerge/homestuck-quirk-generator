import { useState } from "react";
import { api } from "convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { Link } from "@tanstack/react-router";
import type { Id } from "convex/_generated/dataModel";
import { Tile } from "@/components/Tile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { CreateCollectionDialog } from "./CreateCollectionDialog";
import { DeleteCollectionDialog } from "./DeleteCollectionDialog";
import { convertToSlug } from "@/lib/slugify";
import {
  EditIcon,
  Trash2Icon,
  ChevronUpIcon,
  ChevronDownIcon,
  Check,
  X,
  ExternalLink,
} from "lucide-react";

type Collection = {
  _id: Id<"collections">;
  name: string;
  description: string;
  order: number;
};

type Props = {
  usernameSlug: string;
};

export function CollectionViewer(props: Props) {
  const data = useQuery(api.collections.list, {
    usernameSlug: props.usernameSlug,
  });
  const reorderCollection = useMutation(api.collections.reorder);
  const updateCollection = useMutation(api.collections.update);

  // State for inline editing
  const [editingId, setEditingId] = useState<Id<"collections"> | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  if (data === undefined) {
    return <div>Loading...</div>;
  }

  const existingCollectionNames = data.collections.map(
    (collection: Collection) => collection.name,
  );

  const handleMoveUp = async (
    collectionId: Id<"collections">,
    currentOrder: number,
  ) => {
    if (currentOrder > 0) {
      try {
        await reorderCollection({
          collectionId,
          newOrder: currentOrder - 1,
        });
      } catch (error) {
        console.error("Failed to move collection up:", error);
      }
    }
  };

  const handleMoveDown = async (
    collectionId: Id<"collections">,
    currentOrder: number,
  ) => {
    if (currentOrder < data.collections.length - 1) {
      try {
        await reorderCollection({
          collectionId,
          newOrder: currentOrder + 1,
        });
      } catch (error) {
        console.error("Failed to move collection down:", error);
      }
    }
  };

  const handleEdit = (collection: Collection) => {
    setEditingId(collection._id);
    setEditName(collection.name);
    setEditDescription(collection.description);
  };

  const handleSave = async (collectionId: Id<"collections">) => {
    try {
      await updateCollection({
        collectionId,
        name: editName,
        description: editDescription,
      });
      setEditingId(null);
    } catch (error) {
      console.error("Failed to update collection:", error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditName("");
    setEditDescription("");
  };

  return (
    <Tile>
      <div className="flex flex-col gap-4 px-6 pb-6">
        <div className="flex flex-col md:flex-row gap-4 md:gap-0 md:justify-between">
          <h1 className="text-2xl font-bold">Collections</h1>
          {data.collectionBelongsToUser && (
            <CreateCollectionDialog
              existingCollectionNames={existingCollectionNames}
            />
          )}
        </div>

        {data.collections.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {data.collectionBelongsToUser
              ? "No collections yet. Create your first collection!"
              : "No collections found."}
          </div>
        ) : (
          <div className="flex flex-col">
            {data.collections.map((collection: Collection, index) => (
              <div key={collection._id}>
                <div className="flex items-start justify-between p-4 gap-4">
                  <div className="flex-1 min-w-0">
                    {editingId === collection._id ? (
                      // Editing mode
                      <div className="space-y-3">
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="Collection name"
                          className="text-lg font-semibold"
                          autoFocus
                        />
                        <Textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          placeholder="Optional description"
                          rows={2}
                          className="resize-none text-sm"
                        />
                      </div>
                    ) : (
                      // Display mode
                      <div>
                        <Link
                          to="/q/{$user}/{-$collection}"
                          params={{
                            user: props.usernameSlug,
                            collection: convertToSlug(collection.name),
                          }}
                          className="block group"
                        >
                          <h3 className="font-semibold text-lg text-white block truncate group-hover:text-blue-400 transition-colors">
                            {collection.name}
                            <ExternalLink className="inline-block w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </h3>
                        </Link>
                        {collection.description && (
                          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                            {collection.description}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {data.collectionBelongsToUser && (
                    <div className="flex items-center gap-1">
                      {editingId === collection._id ? (
                        // Editing actions
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => handleSave(collection._id)}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-600 hover:text-gray-700 hover:bg-gray-100"
                            onClick={handleCancel}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        // Normal actions
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                            onClick={() =>
                              handleMoveUp(collection._id, collection.order)
                            }
                            disabled={index === 0}
                          >
                            <ChevronUpIcon className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                            onClick={() =>
                              handleMoveDown(collection._id, collection.order)
                            }
                            disabled={index === data.collections.length - 1}
                          >
                            <ChevronDownIcon className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                            onClick={() => handleEdit(collection)}
                          >
                            <EditIcon className="w-4 h-4" />
                          </Button>
                          <DeleteCollectionDialog
                            collectionId={collection._id}
                            collectionName={collection.name}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2Icon className="w-4 h-4" />
                            </Button>
                          </DeleteCollectionDialog>
                        </>
                      )}
                    </div>
                  )}
                </div>
                {index < data.collections.length - 1 && (
                  <Separator orientation="horizontal" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Tile>
  );
}
