import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    username: v.string(),
    usernameSlug: v.string(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_username", ["username"])
    .index("by_username_slug", ["usernameSlug"]),

  collections: defineTable({
    name: v.string(),
    description: v.string(),
    order: v.number(),
    userId: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_order", ["userId", "order"]),

  quirks: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    color: v.string(),
    order: v.number(),
    collectionId: v.id("collections"),
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
  })
    .index("by_collection", ["collectionId"])
    .index("by_collection_and_order", ["collectionId", "order"]),
});
