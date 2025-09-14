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

/**
 * Safely validates if a regex pattern is valid
 */
export function isValidRegex(pattern: string): boolean {
  try {
    new RegExp(pattern);
    return true;
  } catch {
    return false;
  }
}

/**
 * Safely creates a RegExp, returning null if invalid
 */
export function createSafeRegex(
  pattern: string,
  flags?: string,
): RegExp | null {
  try {
    return new RegExp(pattern, flags);
  } catch {
    return null;
  }
}

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
        if (originalChar === originalChar?.toUpperCase()) {
          result += replacementChar?.toUpperCase() ?? "";
        } else {
          result += replacementChar?.toLowerCase() ?? "";
        }
      } else {
        // If replacement is longer than original, keep remaining chars lowercase
        result += replacement[i]?.toLowerCase() ?? "";
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
}) {
  // Check if regex is valid first
  const regex = createSafeRegex(
    params.regex,
    params.caseSensitive ? "g" : "gi",
  );
  if (!regex) {
    // If regex is invalid, return the original text unchanged
    console.warn(`Invalid regex pattern: ${params.regex}`);
    return params.text;
  }

  const tempLeftParenthesis = "\u201c";
  const tempRightParenthesis = "\u201d";

  return params.text
    .replace(/\(/g, tempLeftParenthesis)
    .replace(/\)/g, tempRightParenthesis)
    .replace(regex, params.replacement)
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
  // Check if regex is valid first
  const regex = createSafeRegex(
    params.match,
    params.caseSensitive ? "g" : "gi",
  );
  if (!regex) {
    // If regex is invalid, return the original text unchanged
    console.warn(
      `Invalid regex pattern in random replacement: ${params.match}`,
    );
    return params.text;
  }

  return params.text.replace(regex, (match) => {
    const mathRandom = Math.random();
    if (mathRandom > params.probability) {
      return match;
    }
    return (
      params.replacements[
        Math.floor(mathRandom * params.replacements.length)
      ]?.replace("$1", match) ?? ""
    );
  });
}

export function applyQuirk(params: { quirk: Quirk; text: string }) {
  return params.quirk.attributes.reduce((acc, attribute) => {
    const mathRandom = Math.random();
    if (
      attribute.probability !== undefined &&
      attribute.type !== "random" &&
      mathRandom > attribute.probability
    ) {
      return acc;
    }

    // Check condition with safe regex
    if (attribute.condition) {
      const conditionRegex = createSafeRegex(attribute.condition);
      if (!conditionRegex) {
        console.warn(`Invalid regex in condition: ${attribute.condition}`);
        return acc;
      }
      if (!conditionRegex.test(acc)) {
        return acc;
      }
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
