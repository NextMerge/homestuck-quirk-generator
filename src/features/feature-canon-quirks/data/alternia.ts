import type { Quirk } from "@/features/feature-quirk-builder/utilities/quirk";

export const aradiaColor = "#A10000";

export const alterniaQuirks: Quirk[] = [
  {
    name: "Aradia Megido",
    color: aradiaColor,
    attributes: [
      {
        type: "regex",
        match: "(.*)",
        replacement: "lower($1)",
      },
      {
        type: "simple",
        match: "o",
        replacement: "0",
      },
      {
        type: "suffix",
        probability: 0.1,
        text: " ribbit",
      },
    ],
  },
];
