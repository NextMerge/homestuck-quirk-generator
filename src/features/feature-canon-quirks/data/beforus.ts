import type { Quirk } from "@/features/feature-quirk-builder/utilities/quirk";
import {
  equiusColor,
  eridanColor,
  kanayaColor,
  lowerCaseAll,
  nepetaColor,
  solluxColor,
  tavrosColor,
  tereziColor,
  upperCaseAll,
} from "./alternia";
import { catPuns } from "./catPuns";

export const beforusQuirks: Quirk[] = [
  {
    id: "rufioh-nitram",
    name: "Rufioh Nitram",
    color: tavrosColor,
    attributes: [
      lowerCaseAll,
      {
        type: "word",
        match: "girl",
        replacement: "doll",
      },
      {
        type: "word",
        match: "girls",
        replacement: "dolls",
      },
      {
        type: "simple",
        match: "i",
        replacement: "1",
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
    id: "mituna-captor",
    name: "Mituna Captor",
    color: solluxColor,
    attributes: [
      upperCaseAll,
      {
        type: "regex",
        match: "[S7]",
        replacement: "7H",
        probability: 0.1,
      },
      {
        type: "simple",
        match: "A",
        replacement: "4",
      },
      {
        type: "simple",
        match: "B",
        replacement: "8",
      },
      {
        type: "simple",
        match: "E",
        replacement: "3",
      },
      {
        type: "simple",
        match: "I",
        replacement: "1",
      },
      {
        type: "simple",
        match: "O",
        replacement: "0",
      },
      {
        type: "simple",
        match: "S",
        replacement: "5",
      },
      {
        type: "simple",
        match: "T",
        replacement: "7",
      },
    ],
  },
  {
    id: "kankri-vantas",
    name: "Kankri Vantas",
    color: "#FF0000",
    attributes: [
      {
        type: "regex",
        match: "[Bb]",
        replacement: "6",
      },
      {
        type: "regex",
        match: "[Oo]",
        replacement: "9",
      },
    ],
  },
  {
    id: "meulin-leijon",
    name: "Meulin Leijon",
    color: nepetaColor,
    attributes: [
      upperCaseAll,
      {
        type: "simple",
        match: "EE",
        replacement: "33",
      },
      {
        type: "regex",
        match: "(3{2,})E",
        replacement: "$13",
      },
      ...catPuns,
      {
        type: "simple",
        match: "OMG",
        replacement: "MOG",
      },
    ],
  },
  {
    id: "porrim-maryam",
    name: "Porrim Maryam",
    color: kanayaColor,
    attributes: [
      {
        type: "regex",
        match: "([0Oo])",
        replacement: "$1+",
      },
      {
        type: "simple",
        match: "plus",
        replacement: "+",
      },
    ],
  },
  {
    id: "latula-pyrope",
    name: "Latula Pyrope",
    color: tereziColor,
    attributes: [
      {
        type: "emoticon",
        replacementEyes: ">$1",
        replacementSmile: "]",
        replacementFrown: "[",
      },
      {
        type: "wordMatchCase",
        match: "girl",
        replacement: "grl",
      },
      {
        type: "simple",
        match: "a",
        replacement: "4",
      },
      {
        type: "simple",
        match: "i",
        replacement: "1",
      },
      {
        type: "simple",
        match: "e",
        replacement: "3",
      },
    ],
  },
  {
    id: "horuss-zahhak",
    name: "Horuss Zahhak",
    color: equiusColor,
    attributes: [
      {
        type: "regex",
        match: "([Xx]|ks)",
        replacement: "%",
      },
      {
        type: "prefix",
        text: "8=D < ",
      },
    ],
  },
  {
    id: "cronus-ampora",
    name: "Cronus Ampora",
    color: eridanColor,
    attributes: [
      {
        type: "regex",
        match: "[wv]",
        replacement: "vw",
      },
      {
        type: "regex",
        match: "vw",
        replacement: "wv",
        probability: 0.5,
      },
      {
        type: "simple",
        match: "B",
        replacement: "8",
      },
    ],
  },
];
