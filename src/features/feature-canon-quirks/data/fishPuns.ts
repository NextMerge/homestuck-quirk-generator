import type { Quirk } from "@/features/feature-quirk-builder/utilities/quirk";

export const fishPuns: Quirk["attributes"] = [
  {
    type: "matchCase",
    match: "kill",
    replacement: "krill",
  },
  {
    type: "matchCase",
    match: "well",
    replacement: "whale",
  },
  {
    type: "matchCase",
    match: "fine",
    replacement: "fin",
  },
  {
    type: "matchCase",
    match: "see",
    replacement: "sea",
  },
  {
    type: "matchCase",
    match: "should",
    replacement: "shoald",
  },
  {
    type: "matchCase",
    match: "kid",
    replacement: "squid",
  },
  {
    type: "matchCase",
    match: "sure",
    replacement: "shore",
  },
  {
    type: "matchCase",
    match: "crap",
    replacement: "carp",
  },
  {
    type: "matchCase",
    match: "selfish",
    replacement: "shellfish",
  },
  {
    type: "matchCase",
    match: "what are|what do",
    replacement: "water",
  },
];
