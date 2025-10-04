import { alterniaQuirks } from "@/features/feature-canon-quirks/data/alternia";
import { beforusQuirks } from "@/features/feature-canon-quirks/data/beforus";
import { cherubsQuirks } from "@/features/feature-canon-quirks/data/cherubs";
import { hiveswapQuirks } from "@/features/feature-canon-quirks/data/hiveswap";
import { spritesQuirks } from "@/features/feature-canon-quirks/data/sprites";
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
      return [
        ...alterniaQuirks,
        ...beforusQuirks,
        ...cherubsQuirks,
        ...spritesQuirks,
        ...hiveswapQuirks,
      ];
    }
    if (selectedPreset === "Beforus") {
      return beforusQuirks;
    }

    if (selectedPreset === "Cherubs") {
      return cherubsQuirks;
    }

    if (selectedPreset === "Sprites") {
      return spritesQuirks;
    }

    if (selectedPreset === "Hiveswap") {
      return hiveswapQuirks;
    }

    return alterniaQuirks;
  }, [selectedPreset]);

  return (
    <QuirkProvider>
      <main className="space-y-6 py-6">
        <CanonQuirksHeader
          selectedPreset={selectedPreset}
          setSelectedPreset={setSelectedPreset}
        />
        <QuirkTable quirks={quirks} pinKey="canon" />
      </main>
      <button
        type="button"
        onClick={() => {
          throw new Error("Sentry Test Error");
        }}
      >
        Break the world
      </button>
    </QuirkProvider>
  );
}
