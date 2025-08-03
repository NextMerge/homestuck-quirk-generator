import type { Quirk } from "@/features/feature-quirk-builder/utilities/quirk";
import { lowerCaseAll, upperCaseAll } from "./alternia";

export const cherubsQuirks: Quirk[] = [
  {
    id: "caliborn",
    name: "Caliborn",
    color: "#323232",
    attributes: [
      upperCaseAll,
      {
        type: "simple",
        match: "U",
        replacement: "u",
      },
    ],
  },
  {
    id: "calliope",
    name: "Calliope",
    color: "#929292",
    attributes: [
      lowerCaseAll,
      {
        type: "simple",
        match: "u",
        replacement: "U",
      },
    ],
  },
];
