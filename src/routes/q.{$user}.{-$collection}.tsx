import { CollectionViewer } from "@/features/feature-quirk-builder/ui/CollectionViewer";
import { QuirkViewer } from "@/features/feature-quirk-builder/ui/QuirkViewer";
import { QuirkProvider } from "@/features/feature-quirk-builder/ui/QuirkContext";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/q/{$user}/{-$collection}")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user, collection } = Route.useParams();

  return (
    <main className="p-6">
      {collection === undefined ? (
        <CollectionViewer usernameSlug={user} />
      ) : (
        <QuirkViewer usernameSlug={user} collectionSlug={collection} />
      )}
    </main>
  );
}
