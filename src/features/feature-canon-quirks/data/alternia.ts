import type { Quirk } from "@/features/feature-quirk-builder/utilities/quirk";
import { catPuns } from "./catPuns";
import { fishPuns } from "./fishPuns";

export const aradiaColor = "#A10000";
export const tavrosColor = "#A15000";
export const solluxColor = "#A1A100";
export const kanayaColor = "#008141";
export const nepetaColor = "#416600";
export const tereziColor = "#008282";
export const vriskaColor = "#005682";
export const equiusColor = "#3030B9";
export const gamzeeColor = "#5700B0";
export const eridanColor = "#6A006A";

export const upperCaseAll = {
  type: "regex",
  match: "(.*)",
  replacement: "upper($1)",
} as const;

export const lowerCaseAll = {
  type: "regex",
  match: "(.*)",
  replacement: "lower($1)",
} as const;

export const alterniaQuirks: Quirk[] = [
  {
    id: "aradia-megido",
    name: "Aradia Megido",
    color: aradiaColor,
    attributes: [
      lowerCaseAll,
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
      upperCaseAll,
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
        replacementEyes: "}$1",
        replacementSmile: "",
        replacementFrown: "",
      },
    ],
  },
  {
    id: "sollux-captor",
    name: "Sollux Captor",
    color: solluxColor,
    attributes: [
      lowerCaseAll,
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
    attributes: [upperCaseAll],
  },
  {
    id: "nepeta-leijon",
    name: "Nepeta Leijon",
    color: nepetaColor,
    attributes: [
      lowerCaseAll,
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
  {
    id: "kanaya-maryam",
    name: "Kanaya Maryam",
    color: kanayaColor,
    attributes: [
      {
        type: "regex",
        match: "^(\\W*)(\\w)",
        replacement: "$1upper($2)",
      },
      {
        type: "regex",
        match: "(\\s|\\s\\W)([a-zA-Z])",
        replacement: "$1upper($2)",
      },
    ],
  },
  {
    id: "terezi-pyrope",
    name: "Terezi Pyrope",
    color: tereziColor,
    attributes: [
      upperCaseAll,
      {
        type: "simple",
        match: "A",
        replacement: "4",
      },
      {
        type: "simple",
        match: "I",
        replacement: "1",
      },
      {
        type: "simple",
        match: "E",
        replacement: "3",
      },
      {
        type: "emoticon",
        replacementEyes: ">$1",
        replacementSmile: "]",
        replacementFrown: "[",
      },
    ],
  },
  {
    id: "vriska-serket",
    name: "Vriska Serket",
    color: vriskaColor,
    attributes: [
      {
        type: "simple",
        match: "b",
        replacement: "8",
      },
      {
        type: "simple",
        match: "ate",
        replacement: "8",
      },
      {
        type: "simple",
        match: "ait",
        replacement: "8",
      },
      {
        type: "wordMatchCase",
        match: "great",
        replacement: "gr8",
      },
      {
        type: "emoticon",
        replacementEyes: ":::$1",
        replacementSmile: "",
        replacementFrown: "",
      },
    ],
  },
  {
    id: "equius-zahhak",
    name: "Equius Zahhak",
    color: equiusColor,
    attributes: [
      {
        type: "simple",
        match: "x",
        replacement: "%",
      },
      {
        type: "matchCase",
        match: "nay",
        replacement: "neigh",
      },
      {
        type: "simple",
        match: "loo",
        replacement: "100",
      },
      {
        type: "simple",
        match: "strong",
        replacement: "STRONG",
      },
      {
        type: "prefix",
        text: "D --> ",
      },
    ],
  },
  {
    id: "gamzee-makara",
    name: "Gamzee Makara",
    color: gamzeeColor,
    attributes: [
      {
        type: "regex",
        match: "(.*)",
        replacement: "oddCase($1)",
      },
      {
        type: "emoticon",
        replacementEyes: "$1o",
        replacementSmile: "",
        replacementFrown: "",
      },
    ],
  },
  {
    id: "eridan-ampora",
    name: "Eridan Ampora",
    color: eridanColor,
    attributes: [
      lowerCaseAll,
      {
        type: "simple",
        match: "w",
        replacement: "ww",
      },
      {
        type: "simple",
        match: "v",
        replacement: "vv",
      },
    ],
  },
  {
    id: "feferi-peixes",
    name: "Feferi Peixes",
    color: "#77003C",
    attributes: [
      ...fishPuns,
      {
        type: "simple",
        match: "h",
        replacement: ")(",
      },
      {
        type: "simple",
        match: "E",
        replacement: "-E",
        caseSensitive: true,
      },
      {
        type: "emoticon",
        replacementEyes: "38",
        replacementSmile: "",
        replacementFrown: "",
      },
    ],
  },
];
