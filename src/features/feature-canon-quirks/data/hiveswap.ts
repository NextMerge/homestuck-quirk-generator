import type { Quirk } from "@/features/feature-quirk-builder/utilities/quirk";
import { equiusColor, lowerCaseAll, vriskaColor } from "./alternia";

const diemenColor = "#6F210E";
const skyllaColor = "#A25200";
const bronyaColor = "#008342";
const tagoraColor = "#008484";
const polypaColor = "#426800";

export const hiveswapQuirks: Quirk[] = [
  {
    id: "xefros-tritoh",
    name: "Xefros Tritoh",
    color: "#BB0000",
    attributes: [
      {
        type: "word",
        match: "ten",
        replacement: "X",
      },
      {
        type: "simple",
        match: "cross",
        replacement: "X",
      },
      {
        type: "simple",
        match: "trans",
        replacement: "X",
      },
      {
        type: "simple",
        match: "x",
        replacement: "X",
      },
      {
        type: "emoticon",
        replacementEyes: "X$1",
        replacementSmile: "",
        replacementFrown: "",
      },
    ],
  },
  {
    id: "trizza-tethis",
    name: "Trizza Tethis",
    color: "#6E003C",
    attributes: [
      {
        type: "simple",
        match: "w",
        replacement: "ψ",
      },
    ],
  },
  {
    id: "diemen-xicali",
    name: "Diemen Xicali",
    color: diemenColor,
    attributes: [
      {
        type: "prefix",
        text: "(| ",
      },
      {
        type: "suffix",
        text: " |)",
      },
    ],
  },
  {
    id: "ardata-carmia",
    name: "Ardata Carmia",
    color: vriskaColor,
    attributes: [
      lowerCaseAll,
      {
        type: "simple",
        match: "i",
        replacement: "iii",
      },
    ],
  },
  {
    id: "amisia-erdehn",
    name: "Amisia Erdehn",
    color: equiusColor,
    attributes: [
      lowerCaseAll,
      {
        type: "simple",
        match: "u",
        replacement: "uu",
      },
    ],
  },
  {
    id: "skylla-koriga",
    name: "Skylla Koriga",
    color: skyllaColor,
    attributes: [
      {
        type: "matchCase",
        match: "y",
        replacement: "yy",
      },
    ],
  },
  {
    id: "bronya-ursama",
    name: "Bronya Ursama",
    color: bronyaColor,
    attributes: [
      {
        type: "prefix",
        text: "vV ",
      },
      {
        type: "suffix",
        text: " Vv",
      },
    ],
  },
  {
    id: "tagora-gorjek",
    name: "Tagora Gorjek",
    color: tagoraColor,
    attributes: [
      {
        type: "suffix",
        text: " *_________",
      },
    ],
  },
  {
    id: "vikare-ratite",
    name: "Vikare Ratite",
    color: skyllaColor,
    attributes: [
      {
        type: "prefix",
        text: "~",
      },
      {
        type: "suffix",
        text: "~",
      },
    ],
  },
  {
    id: "polypa-goezee",
    name: "Polypa Goezee",
    color: polypaColor,
    attributes: [
      lowerCaseAll,
      {
        type: "regex",
        match: "\\s[\\.,]|[\\.,]",
        replacement: " *",
      },
      {
        type: "suffix",
        text: " *|",
      },
    ],
  },
  {
    id: "zebruh-codakk",
    name: "Zebruh Codakk",
    description:
      "Add commas to the start of the input text to change the wrapping quadrant.",
    color: equiusColor,
    attributes: [
      {
        type: "suffix",
        condition: "^,,,",
        text: "♤",
      },
      {
        type: "regex",
        match: "^,,,",
        replacement: "♤",
      },
      {
        type: "suffix",
        condition: "^,,",
        text: "♧",
      },
      {
        type: "regex",
        match: "^,,",
        replacement: "♧",
      },
      {
        type: "suffix",
        condition: "^,",
        text: "♡",
      },
      {
        type: "regex",
        match: "^,",
        replacement: "♡",
      },
      {
        type: "prefix",
        condition: "^[^♤♧♡]",
        text: "♢",
      },
      {
        type: "suffix",
        condition: "^[^♤♧♡]",
        text: "♢",
      },
    ],
  },
  {
    id: "elwurd",
    name: "Elwurd",
    color: vriskaColor,
    attributes: [
      lowerCaseAll,
      {
        type: "simple",
        match: "l",
        replacement: "L",
      },
    ],
  },
];
