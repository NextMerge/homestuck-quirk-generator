import { api } from "convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { Link } from "@tanstack/react-router";
import type { Id } from "convex/_generated/dataModel";
import { Tile } from "@/components/Tile";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CreateCollectionDialog } from "./CreateCollectionDialog";
import { DeleteCollectionDialog } from "./DeleteCollectionDialog";
import { convertToSlug } from "@/lib/slugify";
import {
  EditIcon,
  Trash2Icon,
  ChevronUpIcon,
  ChevronDownIcon,
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
                <div className="flex items-center justify-between p-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-white block truncate">
                      {collection.name}
                    </h3>
                    {collection.description && (
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                        {collection.description}
                      </p>
                    )}
                  </div>

                  {data.collectionBelongsToUser && (
                    <div className="flex items-center gap-1 ml-4">
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
                      <Link
                        to="/q/{$user}/{-$collection}"
                        params={{
                          user: props.usernameSlug,
                          collection: convertToSlug(collection.name),
                        }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                        >
                          <EditIcon className="w-4 h-4" />
                        </Button>
                      </Link>
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
