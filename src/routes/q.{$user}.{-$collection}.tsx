import { CollectionViewer } from "@/features/feature-quirk-builder/ui/CollectionViewer";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/q/{$user}/{-$collection}")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user, collection } = Route.useParams();

  if (collection !== undefined) {
    return <div>Collection not found</div>;
  }

  return (
    <main className="p-4">
      <CollectionViewer usernameSlug={user} />
    </main>
  );
}
