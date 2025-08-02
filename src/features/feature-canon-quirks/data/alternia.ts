import type { Quirk } from "@/features/feature-quirk-builder/utilities/quirk";
import { catPuns } from "./catPuns";

export const aradiaColor = "#A10000";
export const tavrosColor = "#A15000";
export const solluxColor = "#A1A100";

export const alterniaQuirks: Quirk[] = [
  {
    id: "aradia-megido",
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
  {
    id: "tavros-nitram",
    name: "Tavros Nitram",
    color: tavrosColor,
    attributes: [
      {
        type: "regex",
        match: "(.*)",
        replacement: "upper($1)",
      },
      {
        type: "simple",
        match: ".",
        replacement: ",",
      },
      {
        type: "regex",
        match: "([,?!]\\W+)(\\w)",
        replacement: "$1lower($2)",
      },
      {
        type: "regex",
        match: "^(\\W*)(\\w)",
        replacement: "$1lower($2)",
      },
      {
        type: "emoticon",
        match: "[:;]",
        replacementEyes: ":",
        replacementMouth: ")",
      },
    ],
  },
  {
    id: "sollux-captor",
    name: "Sollux Captor",
    color: solluxColor,
    attributes: [
      {
        type: "regex",
        match: "(.*)",
        replacement: "lower($1)",
      },
      {
        type: "simple",
        match: "i",
        replacement: "ii",
      },

      {
        type: "simple",
        match: "s",
        replacement: "2",
      },
      {
        type: "word",
        match: "(too|to)",
        replacement: "two",
      },
    ],
  },
  {
    id: "karkat-vantas",
    name: "Karkat Vantas",
    color: "#626262",
    attributes: [
      {
        type: "regex",
        match: "(.*)",
        replacement: "upper($1)",
      },
    ],
  },
  {
    id: "nepeta-leijon",
    name: "Nepeta Leijon",
    color: "#416600",
    attributes: [
      {
        type: "regex",
        match: "(.*)",
        replacement: "lower($1)",
      },
      {
        type: "simple",
        match: "ee",
        replacement: "33",
      },
      {
        type: "regex",
        match: "(3{2,})e",
        replacement: "$13",
      },
      ...catPuns,
      {
        type: "prefix",
        text: ":33 < ",
      },
    ],
  },
];
