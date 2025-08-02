import { alterniaQuirks } from "@/features/feature-canon-quirks/data/alternia";
import { CanonQuirksHeader } from "@/features/feature-canon-quirks/ui/QuirkHeader";
import { QuirkProvider } from "@/features/feature-quirk-builder/ui/QuirkContext";
import { QuirkTable } from "@/features/feature-quirk-builder/ui/QuirkTable";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <QuirkProvider>
      <main className="space-y-6 p-6">
        <CanonQuirksHeader />
        <QuirkTable quirks={alterniaQuirks} />
      </main>
    </QuirkProvider>
  );
}
