const attributeTypes = [
  "simple",
  "word",
  "wordMatchCase",
  "matchCase",
  "regex",
  "prefix",
  "suffix",
  "emoticon",
  "random",
] as const;

const attributeInformation: Record<
  (typeof attributeTypes)[number],
  {
    name: string;
    description: string;
  }
> = {
  simple: {
    name: "Simple Replace",
    description: "Replace a single character with a replacement",
  },
  word: {
    name: "Word Replace",
    description: "Replace a word with a replacement",
  },
  wordMatchCase: {
    name: "Word Replace Match Case",
    description:
      "Replace a word with a replacement, matching the case of the original word",
  },
  matchCase: {
    name: "Match Case",
    description:
      "Replace a character with a replacement, matching the case of the original character",
  },
  regex: {
    name: "Regex Replace",
    description: "Replace a regex with a replacement",
  },
  prefix: {
    name: "Prefix",
    description: "Add a prefix to the text",
  },
  suffix: {
    name: "Suffix",
    description: "Add a suffix to the text",
  },
  emoticon: {
    name: "Emoticon",
    description: "Replace an emoticon with a replacement",
  },
  random: {
    name: "Random",
    description: "Randomly replace a character with a replacement",
  },
};

type BaseQuirkAttribute = {
  condition?: string;
  probability?: number;
};

type SimpleReplaceAttribute = BaseQuirkAttribute & {
  type: "simple";
  match: string;
  replacement: string;
  caseSensitive?: boolean;
};

type WordReplaceAttribute = BaseQuirkAttribute & {
  type: "word";
  match: string;
  replacement: string;
  caseSensitive?: boolean;
};

type WordReplaceMatchCaseAttribute = BaseQuirkAttribute & {
  type: "wordMatchCase";
  match: string;
  replacement: string;
};

type MatchCaseAttribute = BaseQuirkAttribute & {
  type: "matchCase";
  match: string;
  replacement: string;
};

type RegexReplaceAttribute = BaseQuirkAttribute & {
  type: "regex";
  match: string;
  replacement: string;
  applyProbabilityToEachMatch?: boolean;
  caseSensitive?: boolean;
};

type PrefixAttribute = BaseQuirkAttribute & {
  type: "prefix";
  text: string;
};

type SuffixAttribute = BaseQuirkAttribute & {
  type: "suffix";
  text: string;
};

type EmoticonAttribute = BaseQuirkAttribute & {
  type: "emoticon";
  replacementEyes: string;
  replacementSmile: string;
  replacementFrown: string;
};

type RandomAttribute = BaseQuirkAttribute & {
  type: "random";
  match: string;
  replacements: string[];
  caseSensitive?: boolean;
};

type QuirkAttribute =
  | SimpleReplaceAttribute
  | WordReplaceAttribute
  | WordReplaceMatchCaseAttribute
  | MatchCaseAttribute
  | RegexReplaceAttribute
  | PrefixAttribute
  | SuffixAttribute
  | EmoticonAttribute
  | RandomAttribute;

export type Quirk = {
  id: string;
  name: string;
  description?: string;
  color: string;
  attributes: QuirkAttribute[];
};

export function replace(params: {
  text: string;
  char: string;
  replacement: string;
  caseSensitive: boolean;
}) {
  // Escape special regex characters in the character
  const escapedChar = params.char.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  return params.text.replace(
    new RegExp(escapedChar, params.caseSensitive ? "g" : "gi"),
    params.replacement,
  );
}

export function replaceWord(params: {
  text: string;
  word: string;
  replacement: string;
  caseSensitive: boolean;
}) {
  // Escape special regex characters in the word
  const escapedWord = params.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Check if the word contains only word characters (letters, digits, underscore)
  const isWordCharactersOnly = /^[a-zA-Z0-9_]+$/.test(params.word);

  if (isWordCharactersOnly) {
    // Use word boundaries for pure word characters, with contraction avoidance
    // (?<![a-zA-Z]') - not preceded by letter + apostrophe (avoids contractions like "don't")
    // \b - word boundary at start and end
    const pattern = `(?<![a-zA-Z]')\\b${escapedWord}\\b`;
    return params.text.replace(
      new RegExp(pattern, params.caseSensitive ? "g" : "gi"),
      params.replacement,
    );
  } else {
    // For words with special characters, use lookahead/lookbehind for non-alphanumeric boundaries
    // (?<![a-zA-Z0-9]) - not preceded by alphanumeric character
    // (?![a-zA-Z0-9]) - not followed by alphanumeric character
    // This ensures we match complete "words" even if they contain special characters
    const pattern = `(?<![a-zA-Z0-9])${escapedWord}(?![a-zA-Z0-9])`;
    return params.text.replace(
      new RegExp(pattern, params.caseSensitive ? "g" : "gi"),
      params.replacement,
    );
  }
}

export function replaceMatchCase(params: {
  text: string;
  char: string;
  replacement: string;
}) {
  return params.text.replace(new RegExp(params.char, "gi"), (match) => {
    if (match === match.toUpperCase()) {
      return params.replacement.toUpperCase();
    }
    return params.replacement.toLowerCase();
  });
}

export function replaceWordMatchCase(params: {
  text: string;
  word: string;
  replacement: string;
}) {
  // Escape special regex characters in the word
  const escapedWord = params.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Check if the word contains only word characters (letters, digits, underscore)
  const isWordCharactersOnly = /^[a-zA-Z0-9_]+$/.test(params.word);

  let pattern: string;
  if (isWordCharactersOnly) {
    // Use word boundaries for pure word characters, with contraction avoidance
    pattern = `(?<![a-zA-Z]')\\b${escapedWord}\\b`;
  } else {
    // For words with special characters, use lookahead/lookbehind for non-alphanumeric boundaries
    pattern = `(?<![a-zA-Z0-9])${escapedWord}(?![a-zA-Z0-9])`;
  }

  // Function to apply case pattern from original to replacement
  function applyCasePattern(original: string, replacement: string): string {
    // Check if original is all uppercase
    if (
      original === original.toUpperCase() &&
      original !== original.toLowerCase()
    ) {
      return replacement.toUpperCase();
    }

    // Check if original is all lowercase
    if (original === original.toLowerCase()) {
      return replacement.toLowerCase();
    }

    // Apply character-by-character case matching for mixed case
    let result = "";
    for (let i = 0; i < replacement.length; i++) {
      if (i < original.length) {
        const originalChar = original[i];
        const replacementChar = replacement[i];

        // Apply case of original character to replacement character
        if (originalChar === originalChar.toUpperCase()) {
          result += replacementChar.toUpperCase();
        } else {
          result += replacementChar.toLowerCase();
        }
      } else {
        // If replacement is longer than original, keep remaining chars lowercase
        result += replacement[i].toLowerCase();
      }
    }

    return result;
  }

  // Replace with case-sensitive callback function
  return params.text.replace(new RegExp(pattern, "gi"), (match) =>
    applyCasePattern(match, params.replacement),
  );
}

export function replaceRegex(params: {
  text: string;
  regex: string;
  replacement: string;
  caseSensitive: boolean;
  probability: number;
  applyProbabilityToEachMatch: boolean;
}) {
  const tempLeftParenthesis = "“";
  const tempRightParenthesis = "”";

  return params.text
    .replace(new RegExp("\\(", "g"), tempLeftParenthesis)
    .replace(new RegExp("\\)", "g"), tempRightParenthesis)
    .replace(
      new RegExp(params.regex, params.caseSensitive ? "g" : "gi"),
      params.replacement,
    )
    .replace(/upper\((.*?)\)/g, (_: string, p1: string) => p1.toUpperCase())
    .replace(/lower\((.*?)\)/g, (_: string, p1: string) => p1.toLowerCase())
    .replace(/oddCase\((.*?)\)/g, (_: string, p1: string) => {
      let letterIndex = 0;
      return p1
        .split("")
        .map((char) => {
          // Only alternate case for letters
          if (/[a-zA-Z]/.test(char)) {
            const result =
              letterIndex % 2 === 0 ? char.toLowerCase() : char.toUpperCase();
            letterIndex++;
            return result;
          }
          // Preserve non-letters as-is
          return char;
        })
        .join("");
    })
    .replace(/evenCase\((.*?)\)/g, (_: string, p1: string) => {
      let letterIndex = 0;
      return p1
        .split("")
        .map((char) => {
          // Only alternate case for letters
          if (/[a-zA-Z]/.test(char)) {
            const result =
              letterIndex % 2 === 0 ? char.toUpperCase() : char.toLowerCase();
            letterIndex++;
            return result;
          }
          // Preserve non-letters as-is
          return char;
        })
        .join("");
    })
    .replace(new RegExp(tempLeftParenthesis, "gi"), "(")
    .replace(new RegExp(tempRightParenthesis, "gi"), ")");
}

export function replaceEmoticon(params: {
  text: string;
  replacementEyes: string;
  replacementSmile: string;
  replacementFrown: string;
}) {
  const eyes = "[:;]";
  const smile = "[\\)]";
  const frown = "[\\(]";

  const replacement = {
    eyes: params.replacementEyes.length > 0 ? params.replacementEyes : "$1",
    smile: params.replacementSmile.length > 0 ? params.replacementSmile : "$2",
    frown: params.replacementFrown.length > 0 ? params.replacementFrown : "$2",
  };

  return params.text
    .replace(
      new RegExp(`(${eyes})(${smile})`, "g"),
      `${replacement.eyes}${replacement.smile}`,
    )
    .replace(
      new RegExp(`(${eyes})(${frown})`, "g"),
      `${replacement.eyes}${replacement.frown}`,
    )
    .replace(new RegExp(`(${eyes})([dD])`, "g"), `${replacement.eyes}$2`);
}

function replaceRandom(params: {
  text: string;
  match: string;
  replacements: string[];
  caseSensitive: boolean;
  probability: number;
}) {
  return params.text.replace(
    new RegExp(params.match, params.caseSensitive ? "g" : "gi"),
    (match) => {
      const mathRandom = Math.random();
      if (mathRandom > params.probability) {
        return match;
      }
      return params.replacements[
        Math.floor(mathRandom * params.replacements.length)
      ].replace("$1", match);
    },
  );
}

export function applyQuirk(params: { quirk: Quirk; text: string }) {
  return params.quirk.attributes.reduce((acc, attribute) => {
    const mathRandom = Math.random();
    if (
      attribute.probability &&
      attribute.type !== "random" &&
      mathRandom > attribute.probability
    ) {
      return acc;
    }

    if (attribute.condition && !new RegExp(attribute.condition).test(acc)) {
      return acc;
    }

    switch (attribute.type) {
      case "simple":
        return replace({
          text: acc,
          char: attribute.match,
          replacement: attribute.replacement,
          caseSensitive: attribute.caseSensitive ?? false,
        });
      case "word":
        return replaceWord({
          text: acc,
          word: attribute.match,
          replacement: attribute.replacement,
          caseSensitive: attribute.caseSensitive ?? false,
        });
      case "wordMatchCase":
        return replaceWordMatchCase({
          text: acc,
          word: attribute.match,
          replacement: attribute.replacement,
        });
      case "matchCase":
        return replaceMatchCase({
          text: acc,
          char: attribute.match,
          replacement: attribute.replacement,
        });
      case "regex":
        return replaceRegex({
          text: acc,
          regex: attribute.match,
          replacement: attribute.replacement,
          caseSensitive: attribute.caseSensitive ?? false,
          probability: attribute.probability ?? 1,
          applyProbabilityToEachMatch:
            attribute.applyProbabilityToEachMatch ?? false,
        });
      case "prefix":
        return `${attribute.text}${acc}`;
      case "suffix":
        return `${acc}${attribute.text}`;
      case "emoticon":
        return replaceEmoticon({
          text: acc,
          replacementEyes: attribute.replacementEyes,
          replacementSmile: attribute.replacementSmile,
          replacementFrown: attribute.replacementFrown,
        });
      case "random":
        return replaceRandom({
          text: acc,
          match: attribute.match,
          replacements: attribute.replacements,
          caseSensitive: attribute.caseSensitive ?? false,
          probability: attribute.probability ?? 1,
        });
    }
  }, params.text);
}
