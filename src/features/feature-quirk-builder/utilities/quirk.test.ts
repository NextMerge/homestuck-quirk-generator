import { describe, expect, it } from "vitest";
import {
  replace,
  replaceWord,
  replaceWordMatchCase,
  isValidRegex,
  createSafeRegex,
  applyQuirk,
  type Quirk,
} from "./quirk";

describe("isValidRegex", () => {
  it("should return true for valid regex patterns", () => {
    expect(isValidRegex("hello")).toBe(true);
    expect(isValidRegex("[a-z]+")).toBe(true);
    expect(isValidRegex("\\d+")).toBe(true);
    expect(isValidRegex(".*")).toBe(true);
  });

  it("should return false for invalid regex patterns", () => {
    expect(isValidRegex("(unclosed")).toBe(false);
    expect(isValidRegex("[unclosed")).toBe(false);
    expect(isValidRegex("*")).toBe(false);
    expect(isValidRegex("?")).toBe(false);
  });
});

describe("createSafeRegex", () => {
  it("should return RegExp for valid patterns", () => {
    const regex = createSafeRegex("hello", "gi");
    expect(regex).toBeInstanceOf(RegExp);
    expect(regex?.source).toBe("hello");
  });

  it("should return null for invalid patterns", () => {
    expect(createSafeRegex("(unclosed")).toBe(null);
    expect(createSafeRegex("[unclosed")).toBe(null);
  });
});

describe("applyQuirk with invalid regex", () => {
  it("should not crash with invalid regex patterns", () => {
    const quirk: Quirk = {
      id: "test",
      name: "Test Quirk",
      color: "#000000",
      attributes: [
        {
          type: "regex",
          match: "(unclosed", // Invalid regex
          replacement: "replacement",
        },
      ],
    };

    // This should not crash
    const result = applyQuirk({ quirk, text: "test text" });
    expect(result).toBe("test text"); // Original text should be unchanged
  });

  it("should not crash with invalid condition regex", () => {
    const quirk: Quirk = {
      id: "test",
      name: "Test Quirk",
      color: "#000000",
      attributes: [
        {
          type: "simple",
          match: "e",
          replacement: "3",
          condition: "[unclosed", // Invalid condition regex
        },
      ],
    };

    // This should not crash
    const result = applyQuirk({ quirk, text: "test text" });
    expect(result).toBe("test text"); // Original text should be unchanged due to invalid condition
  });

  it("should not crash with invalid random regex", () => {
    const quirk: Quirk = {
      id: "test",
      name: "Test Quirk",
      color: "#000000",
      attributes: [
        {
          type: "random",
          match: "*invalid", // Invalid regex
          replacements: ["a", "b", "c"],
          probability: 1,
        },
      ],
    };

    // This should not crash
    const result = applyQuirk({ quirk, text: "test text" });
    expect(result).toBe("test text"); // Original text should be unchanged
  });
});

describe("replace", () => {
  describe("basic character replacement", () => {
    it("should replace all instances of a character", () => {
      const result = replace({
        text: "hello world",
        char: "l",
        replacement: "x",
        caseSensitive: true,
      });
      expect(result).toBe("hexxo worxd");
    });

    it("should replace character at beginning of string", () => {
      const result = replace({
        text: "hello world",
        char: "h",
        replacement: "H",
        caseSensitive: true,
      });
      expect(result).toBe("Hello world");
    });

    it("should replace character at end of string", () => {
      const result = replace({
        text: "hello world",
        char: "d",
        replacement: "D",
        caseSensitive: true,
      });
      expect(result).toBe("hello worlD");
    });
  });

  describe("case sensitivity", () => {
    it("should respect case when caseSensitive is true", () => {
      const result = replace({
        text: "Hello World",
        char: "l",
        replacement: "x",
        caseSensitive: true,
      });
      expect(result).toBe("Hexxo Worxd");
    });

    it("should ignore case when caseSensitive is false", () => {
      const result = replace({
        text: "Hello World",
        char: "l",
        replacement: "x",
        caseSensitive: false,
      });
      expect(result).toBe("Hexxo Worxd");
    });
  });

  describe("special regex characters should be treated literally", () => {
    it("should handle dot (.) as literal character", () => {
      const result = replace({
        text: "hello.world",
        char: ".",
        replacement: "_",
        caseSensitive: true,
      });
      expect(result).toBe("hello_world");
    });

    it("should handle asterisk (*) as literal character", () => {
      const result = replace({
        text: "hello*world*test",
        char: "*",
        replacement: "_",
        caseSensitive: true,
      });
      expect(result).toBe("hello_world_test");
    });

    it("should handle plus (+) as literal character", () => {
      const result = replace({
        text: "2+2=4",
        char: "+",
        replacement: " plus ",
        caseSensitive: true,
      });
      expect(result).toBe("2 plus 2=4");
    });

    it("should handle question mark (?) as literal character", () => {
      const result = replace({
        text: "are you sure?",
        char: "?",
        replacement: "!",
        caseSensitive: true,
      });
      expect(result).toBe("are you sure!");
    });

    it("should handle caret (^) as literal character", () => {
      const result = replace({
        text: "x^2 + y^2",
        char: "^",
        replacement: "**",
        caseSensitive: true,
      });
      expect(result).toBe("x**2 + y**2");
    });

    it("should handle dollar sign ($) as literal character", () => {
      const result = replace({
        text: "cost $5.99",
        char: "$",
        replacement: "USD ",
        caseSensitive: true,
      });
      expect(result).toBe("cost USD 5.99");
    });

    it("should handle parentheses as literal characters", () => {
      const result = replace({
        text: "f(x) = x * 2",
        char: "(",
        replacement: "[",
        caseSensitive: true,
      });
      expect(result).toBe("f[x) = x * 2");
    });

    it("should handle square brackets as literal characters", () => {
      const result = replace({
        text: "array[0] = value",
        char: "[",
        replacement: "(",
        caseSensitive: true,
      });
      expect(result).toBe("array(0] = value");
    });

    it("should handle curly braces as literal characters", () => {
      const result = replace({
        text: "object{key: value}",
        char: "{",
        replacement: "[",
        caseSensitive: true,
      });
      expect(result).toBe("object[key: value}");
    });

    it("should handle pipe (|) as literal character", () => {
      const result = replace({
        text: "cat file.txt | grep pattern",
        char: "|",
        replacement: " and ",
        caseSensitive: true,
      });
      expect(result).toBe("cat file.txt  and  grep pattern");
    });

    it("should handle backslash (\\) as literal character", () => {
      const result = replace({
        text: "path\\to\\file",
        char: "\\",
        replacement: "/",
        caseSensitive: true,
      });
      expect(result).toBe("path/to/file");
    });
  });

  describe("complex scenarios", () => {
    it("should handle multiple special characters", () => {
      const result = replace({
        text: ".$*+?^()[]{}|\\",
        char: ".",
        replacement: "DOT",
        caseSensitive: true,
      });
      expect(result).toBe("DOT$*+?^()[]{}|\\");
    });

    it("should not treat character as regex pattern", () => {
      // Before the fix, this would match any character due to "." being a regex metacharacter
      const result = replace({
        text: "hello world",
        char: ".",
        replacement: "X",
        caseSensitive: true,
      });
      expect(result).toBe("hello world"); // Should remain unchanged since there's no literal "."
    });

    it("should handle empty replacement", () => {
      const result = replace({
        text: "hello.world",
        char: ".",
        replacement: "",
        caseSensitive: true,
      });
      expect(result).toBe("helloworld");
    });
  });
});

describe("replaceWord", () => {
  describe("should match standalone words", () => {
    it("should match word surrounded by spaces", () => {
      const result = replaceWord({
        text: "hello t world",
        word: "t",
        replacement: "X",
        caseSensitive: false,
      });
      expect(result).toBe("hello X world");
    });

    it("should match word at beginning of string", () => {
      const result = replaceWord({
        text: "t is a letter",
        word: "t",
        replacement: "X",
        caseSensitive: false,
      });
      expect(result).toBe("X is a letter");
    });

    it("should match word at end of string", () => {
      const result = replaceWord({
        text: "letter t",
        word: "t",
        replacement: "X",
        caseSensitive: false,
      });
      expect(result).toBe("letter X");
    });

    it("should match word in quotes", () => {
      const result = replaceWord({
        text: "The letter 't' is common",
        word: "t",
        replacement: "X",
        caseSensitive: false,
      });
      expect(result).toBe("The letter 'X' is common");
    });

    it("should match word surrounded by punctuation", () => {
      const result = replaceWord({
        text: "Hello, t! How are you?",
        word: "t",
        replacement: "X",
        caseSensitive: false,
      });
      expect(result).toBe("Hello, X! How are you?");
    });

    it("should match multiple instances", () => {
      const result = replaceWord({
        text: "t and t are the same",
        word: "t",
        replacement: "X",
        caseSensitive: false,
      });
      expect(result).toBe("X and X are the same");
    });
  });

  describe("should NOT match words in contractions", () => {
    it('should not match t in "don\'t"', () => {
      const result = replaceWord({
        text: "I don't like it",
        word: "t",
        replacement: "X",
        caseSensitive: false,
      });
      expect(result).toBe("I don't like it");
    });

    it('should not match t in "can\'t"', () => {
      const result = replaceWord({
        text: "I can't do it",
        word: "t",
        replacement: "X",
        caseSensitive: false,
      });
      expect(result).toBe("I can't do it");
    });

    it('should not match t in "won\'t"', () => {
      const result = replaceWord({
        text: "He won't come",
        word: "t",
        replacement: "X",
        caseSensitive: false,
      });
      expect(result).toBe("He won't come");
    });

    it('should not match t in "isn\'t"', () => {
      const result = replaceWord({
        text: "It isn't working",
        word: "t",
        replacement: "X",
        caseSensitive: false,
      });
      expect(result).toBe("It isn't working");
    });

    it("should not match letters within words", () => {
      const result = replaceWord({
        text: "The cat is on the mat",
        word: "t",
        replacement: "X",
        caseSensitive: false,
      });
      expect(result).toBe("The cat is on the mat");
    });
  });

  describe("case sensitivity", () => {
    it("should respect case sensitivity when true", () => {
      const result = replaceWord({
        text: "Hello T and t",
        word: "t",
        replacement: "X",
        caseSensitive: true,
      });
      expect(result).toBe("Hello T and X");
    });

    it("should ignore case when case sensitivity is false", () => {
      const result = replaceWord({
        text: "Hello T and t",
        word: "t",
        replacement: "X",
        caseSensitive: false,
      });
      expect(result).toBe("Hello X and X");
    });
  });

  describe("special regex characters", () => {
    it("should handle words with special regex characters", () => {
      const result = replaceWord({
        text: "The cost is $5.99 today",
        word: "$5.99",
        replacement: "FREE",
        caseSensitive: false,
      });
      expect(result).toBe("The cost is FREE today");
    });

    it("should handle parentheses in words", () => {
      const result = replaceWord({
        text: "See item (a) below",
        word: "(a)",
        replacement: "(b)",
        caseSensitive: false,
      });
      expect(result).toBe("See item (b) below");
    });

    it("should handle square brackets", () => {
      const result = replaceWord({
        text: "Check [TODO] items",
        word: "[TODO]",
        replacement: "[DONE]",
        caseSensitive: false,
      });
      expect(result).toBe("Check [DONE] items");
    });
  });

  describe("complex scenarios", () => {
    it("should handle mixed contractions and standalone words", () => {
      const result = replaceWord({
        text: "I don't think t is in can't",
        word: "t",
        replacement: "X",
        caseSensitive: false,
      });
      expect(result).toBe("I don't think X is in can't");
    });

    it("should handle multiple different words", () => {
      let text = "The cat can't sit on the mat, but t is a letter";

      // Replace 'cat' but not the 'cat' in "can't"
      text = replaceWord({
        text,
        word: "cat",
        replacement: "dog",
        caseSensitive: false,
      });
      expect(text).toBe("The dog can't sit on the mat, but t is a letter");

      // Replace standalone 't' but not 't' in contractions or words
      text = replaceWord({
        text,
        word: "t",
        replacement: "X",
        caseSensitive: false,
      });
      expect(text).toBe("The dog can't sit on the mat, but X is a letter");
    });

    it("should handle contractions at word boundaries", () => {
      const result = replaceWord({
        text: "t don't t",
        word: "t",
        replacement: "X",
        caseSensitive: false,
      });
      expect(result).toBe("X don't X");
    });
  });
});

describe("replaceWordMatchCase", () => {
  describe("basic case matching", () => {
    it("should match lowercase to lowercase", () => {
      const result = replaceWordMatchCase({
        text: "hello foo world",
        word: "foo",
        replacement: "bar",
      });
      expect(result).toBe("hello bar world");
    });

    it("should match all caps to all caps", () => {
      const result = replaceWordMatchCase({
        text: "hello FOO world",
        word: "foo",
        replacement: "bar",
      });
      expect(result).toBe("hello BAR world");
    });

    it("should match mixed case pattern", () => {
      const result = replaceWordMatchCase({
        text: "hello fOo world",
        word: "foo",
        replacement: "bar",
      });
      expect(result).toBe("hello bAr world");
    });

    it("should match first letter uppercase", () => {
      const result = replaceWordMatchCase({
        text: "hello Foo world",
        word: "foo",
        replacement: "bar",
      });
      expect(result).toBe("hello Bar world");
    });
  });

  describe("different case variations", () => {
    it("should handle FoO pattern", () => {
      const result = replaceWordMatchCase({
        text: "The FoO is here",
        word: "foo",
        replacement: "bar",
      });
      expect(result).toBe("The BaR is here");
    });

    it("should handle fOO pattern", () => {
      const result = replaceWordMatchCase({
        text: "The fOO is here",
        word: "foo",
        replacement: "bar",
      });
      expect(result).toBe("The bAR is here");
    });

    it("should handle all lowercase original", () => {
      const result = replaceWordMatchCase({
        text: "the foo is here",
        word: "FOO",
        replacement: "BAR",
      });
      expect(result).toBe("the bar is here");
    });
  });

  describe("replacement longer than original", () => {
    it("should apply case pattern and lowercase remaining chars", () => {
      const result = replaceWordMatchCase({
        text: "hello FoO world",
        word: "foo",
        replacement: "barbaz",
      });
      expect(result).toBe("hello BaRbaz world");
    });

    it("should handle all caps with longer replacement", () => {
      const result = replaceWordMatchCase({
        text: "hello FOO world",
        word: "foo",
        replacement: "barbaz",
      });
      expect(result).toBe("hello BARBAZ world");
    });
  });

  describe("replacement shorter than original", () => {
    it("should apply available case pattern", () => {
      const result = replaceWordMatchCase({
        text: "hello FooBar world",
        word: "foobar",
        replacement: "baz",
      });
      expect(result).toBe("hello Baz world");
    });
  });

  describe("multiple instances", () => {
    it("should handle multiple words with different cases", () => {
      const result = replaceWordMatchCase({
        text: "foo FOO fOo Foo",
        word: "foo",
        replacement: "bar",
      });
      expect(result).toBe("bar BAR bAr Bar");
    });
  });

  describe("word boundaries", () => {
    it("should not match parts of other words", () => {
      const result = replaceWordMatchCase({
        text: "The food contains foo inside",
        word: "foo",
        replacement: "bar",
      });
      expect(result).toBe("The food contains bar inside");
    });

    it("should not match in contractions", () => {
      const result = replaceWordMatchCase({
        text: "I don't like foo",
        word: "t",
        replacement: "X",
      });
      expect(result).toBe("I don't like foo");
    });
  });

  describe("special characters", () => {
    it("should handle words with special regex characters", () => {
      const result = replaceWordMatchCase({
        text: "The cost is $5.99 today",
        word: "$5.99",
        replacement: "free",
      });
      expect(result).toBe("The cost is free today");
    });
  });
});
