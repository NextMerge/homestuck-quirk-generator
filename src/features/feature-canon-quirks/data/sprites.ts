import type { Quirk } from "@/features/feature-quirk-builder/utilities/quirk";
import { alterniaQuirks } from "./alternia";

export const spritesQuirks: Quirk[] = [
  {
    id: "tavrisprite",
    name: "Tavrisprite",
    color: "#0715CD",
    attributes: [
      {
        type: "emoticon",
        replacementEyes: "}:::$1",
        replacementSmile: "",
        replacementFrown: "",
      },
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ...alterniaQuirks
        .find((q) => q.id === "tavros-nitram")!
        .attributes.filter((a) => a.type !== "emoticon"),
      {
        type: "simple",
        match: "b",
        replacement: "8",
      },
    ],
  },
  {
    id: "erisolsprite",
    name: "Erisolsprite",
    color: "#4AC925",
    attributes: [
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
    ],
  },
];
