import { alterniaQuirks } from "@/features/feature-canon-quirks/data/alternia";
import { beforusQuirks } from "@/features/feature-canon-quirks/data/beforus";
import {
  CanonQuirksHeader,
  type PresetType,
} from "@/features/feature-canon-quirks/ui/QuirkHeader";
import { QuirkProvider } from "@/features/feature-quirk-builder/ui/QuirkContext";
import { QuirkTable } from "@/features/feature-quirk-builder/ui/QuirkTable";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const [selectedPreset, setSelectedPreset] = useState<PresetType>("All");

  const quirks = useMemo(() => {
    if (selectedPreset === "All") {
      return [...alterniaQuirks, ...beforusQuirks];
    }
    if (selectedPreset === "Beforus") {
      return beforusQuirks;
    }
    return alterniaQuirks;
  }, [selectedPreset]);

  return (
    <QuirkProvider>
      <main className="space-y-6 p-6">
        <CanonQuirksHeader
          selectedPreset={selectedPreset}
          setSelectedPreset={setSelectedPreset}
        />
        <QuirkTable quirks={quirks} />
      </main>
    </QuirkProvider>
  );
}
