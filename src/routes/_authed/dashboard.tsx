import { createFileRoute } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";

export const Route = createFileRoute("/_authed/dashboard")({
  component: DashboardComponent,
});

function DashboardComponent() {
  const collections = useQuery(api.collections.list);
  const createCollection = useMutation(api.collections.create);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    setIsSubmitting(true);
    try {
      await createCollection({
        name: name.trim(),
        description: description.trim(),
      });
      setName("");
      setDescription("");
      setShowForm(false);
    } catch (error) {
      console.error("Failed to create collection:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (collections === undefined) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="text-lg">Loading collections...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button
          onClick={() => setShowForm(!showForm)}
          variant={showForm ? "outline" : "default"}
        >
          {showForm ? "Cancel" : "New Collection"}
        </Button>
      </div>

      {showForm && (
        <div className="bg-card mb-8 rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">Create New Collection</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Collection Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter collection name"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter collection description"
                required
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Collection"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Your Collections</h2>

        {collections.length === 0 ? (
          <div className="text-muted-foreground py-12 text-center">
            <p className="mb-2 text-lg">No collections yet</p>
            <p>Create your first collection to get started!</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection) => (
              <div
                key={collection._id}
                className="bg-card rounded-lg border p-6 transition-shadow hover:shadow-md"
              >
                <h3 className="mb-2 text-lg font-semibold">
                  {collection.name}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {collection.description}
                </p>
                <div className="text-muted-foreground text-sm">
                  Created{" "}
                  {new Date(collection._creationTime).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
