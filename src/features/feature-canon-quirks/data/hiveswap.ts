import type { Quirk } from "@/features/feature-quirk-builder/utilities/quirk";
import { equiusColor, lowerCaseAll, vriskaColor } from "./alternia";

const diemenColor = "#6F210E";
const skyllaColor = "#A25200";
const bronyaColor = "#008342";
const tagoraColor = "#008484";
const polypaColor = "#426800";
const folyklColor = "#A2A200";
const chahutColor = "#5C0089";

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
  {
    id: "kuprum-maxlol",
    name: "Kuprum Maxlol",
    color: "#A2A200",
    attributes: [
      lowerCaseAll,
      {
        type: "regex",
        match: "(\\bl+o[ol]*l\\b)",
        replacement: "upper($1)",
      },
      {
        type: "prefix",
        text: ">",
      },
    ],
  },
  {
    id: "folykl-darane",
    name: "Folykl Darane",
    color: folyklColor,
    attributes: [
      {
        type: "random",
        match: "\\b\\s\\b",
        replacements: ["  ", "   ", "    "],
        probability: 0.1,
      },
    ],
  },
  {
    id: "remele-namaaq",
    name: "Remele Namaaq",
    color: vriskaColor,
    attributes: [
      {
        type: "random",
        match: "(\\w+)",
        replacements: ["$1e"],
        probability: 0.5,
      },
    ],
  },
  {
    id: "tyzias-entykk",
    name: "Tyzias Entykk",
    color: tagoraColor,
    attributes: [
      lowerCaseAll,
      {
        type: "simple",
        match: "m",
        replacement: "mmmm",
      },
      {
        type: "simple",
        match: "w",
        replacement: "wwww",
      },
    ],
  },
  {
    id: "chixie-roixmr",
    name: "Chixie Roixmr",
    color: skyllaColor,
    attributes: [
      lowerCaseAll,
      {
        type: "regex",
        match: "\\s[\\.,]|[\\.,]",
        replacement: " /",
      },
    ],
  },
  {
    id: "azdaja-knelax",
    name: "Azdaja Knelax",
    color: folyklColor,
    attributes: [
      {
        type: "prefix",
        text: "||| ",
      },
      {
        type: "suffix",
        text: " |||",
      },
    ],
  },
  {
    id: "chahut-maenad",
    name: "Chahut Maenad",
    color: chahutColor,
    attributes: [
      lowerCaseAll,
      {
        type: "simple",
        match: "t",
        replacement: "T",
      },
    ],
  },
  {
    id: "zebede-tongva",
    name: "Zebede Tongva",
    color: folyklColor,
    attributes: [
      lowerCaseAll,
      {
        type: "regex",
        match: "s\\b",
        replacement: "z",
      },
      {
        type: "emoticon",
        replacementEyes: "z$1",
        replacementSmile: "",
        replacementFrown: "",
      },
    ],
  },
  {
    id: "tegiri-kalbur",
    name: "Tegiri Kalbur",
    color: tagoraColor,
    attributes: [
      {
        type: "simple",
        match: "l",
        replacement: "/",
      },
    ],
  },
  {
    id: "mallek-adalov",
    name: "Mallek Adalov",
    color: vriskaColor,
    attributes: [
      lowerCaseAll,
      {
        type: "simple",
        match: ".",
        replacement: ";",
      },
      {
        type: "word",
        match: "is not",
        replacement: "!=",
      },
      {
        type: "word",
        match: "is",
        replacement: "=",
      },
    ],
  },
  {
    id: "lyner-skalbi",
    name: "Lynera Skalbi",
    color: bronyaColor,
    attributes: [
      {
        type: "prefix",
        text: "-",
      },
    ],
  },
  {
    id: "tirona-kasund",
    name: "Tirona Kasund",
    color: tagoraColor,
    attributes: [
      {
        type: "simple",
        match: "e",
        replacement: "33",
      },
      {
        type: "emoticon",
        replacementEyes: "33$1",
        replacementSmile: "",
        replacementFrown: "",
      },
    ],
  },
  {
    id: "boldir-lamati",
    name: "Boldir Lamati",
    color: polypaColor,
    attributes: [
      lowerCaseAll,
      {
        type: "prefix",
        text: "(",
      },
      {
        type: "suffix",
        text: ")",
      },
    ],
  },
  {
    id: "marsti-houtek",
    name: "Marsti Houtek",
    color: diemenColor,
    attributes: [
      {
        type: "suffix",
        text: " -_-",
      },
    ],
  },
  {
    id: "karako-pierot",
    name: "Karako Pierot",
    color: chahutColor,
    attributes: [
      {
        type: "regex",
        match: "[A-Z]+",
        replacement: "HONK",
        caseSensitive: true,
      },
      {
        type: "regex",
        match: "[a-z]+",
        replacement: "honk",
        caseSensitive: true,
      },
    ],
  },
];
