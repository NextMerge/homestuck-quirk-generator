import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  products: defineTable({
    title: v.string(),
    imageId: v.string(),
    price: v.number(),
  }),

  collections: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    userId: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_slug", ["slug"])
    .index("by_user_and_slug", ["userId", "slug"]),

  quirks: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    color: v.string(),
    attributes: v.array(
      v.union(
        // Simple Replace Attribute
        v.object({
          type: v.literal("simple"),
          match: v.string(),
          replacement: v.string(),
          caseSensitive: v.optional(v.boolean()),
          condition: v.optional(v.string()),
          probability: v.optional(v.number()),
        }),
        // Word Replace Attribute
        v.object({
          type: v.literal("word"),
          match: v.string(),
          replacement: v.string(),
          caseSensitive: v.optional(v.boolean()),
          condition: v.optional(v.string()),
          probability: v.optional(v.number()),
        }),
        // Word Replace Match Case Attribute
        v.object({
          type: v.literal("wordMatchCase"),
          match: v.string(),
          replacement: v.string(),
          condition: v.optional(v.string()),
          probability: v.optional(v.number()),
        }),
        // Match Case Attribute
        v.object({
          type: v.literal("matchCase"),
          match: v.string(),
          replacement: v.string(),
          condition: v.optional(v.string()),
          probability: v.optional(v.number()),
        }),
        // Regex Replace Attribute
        v.object({
          type: v.literal("regex"),
          match: v.string(),
          replacement: v.string(),
          applyProbabilityToEachMatch: v.optional(v.boolean()),
          caseSensitive: v.optional(v.boolean()),
          condition: v.optional(v.string()),
          probability: v.optional(v.number()),
        }),
        // Prefix Attribute
        v.object({
          type: v.literal("prefix"),
          text: v.string(),
          condition: v.optional(v.string()),
          probability: v.optional(v.number()),
        }),
        // Suffix Attribute
        v.object({
          type: v.literal("suffix"),
          text: v.string(),
          condition: v.optional(v.string()),
          probability: v.optional(v.number()),
        }),
        // Emoticon Attribute
        v.object({
          type: v.literal("emoticon"),
          replacementEyes: v.string(),
          replacementSmile: v.string(),
          replacementFrown: v.string(),
          condition: v.optional(v.string()),
          probability: v.optional(v.number()),
        }),
        // Random Attribute
        v.object({
          type: v.literal("random"),
          match: v.string(),
          replacements: v.array(v.string()),
          caseSensitive: v.optional(v.boolean()),
          condition: v.optional(v.string()),
          probability: v.optional(v.number()),
        }),
      ),
    ),
    userId: v.string(),
  }).index("by_user", ["userId"]),
});
