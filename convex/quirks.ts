import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Define the QuirkAttribute validator for reuse
const quirkAttributeValidator = v.union(
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
);

export const list = query({
  args: {
    username: v.string(),
    collectionSlug: v.string(),
  },
  handler: async (ctx, args) => {
    const quirks = await ctx.db
      .query("quirks")
      .withIndex("by_user_and_collection", (q) =>
        q.eq("userId", user.subject).eq("collectionSlug", args.collectionSlug),
      )
      .collect();

    return quirks;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    color: v.string(),
    attributes: v.array(quirkAttributeValidator),
  },
  returns: v.id("quirks"),
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("Unauthorized");
    }

    return await ctx.db.insert("quirks", {
      name: args.name,
      description: args.description,
      color: args.color,
      attributes: args.attributes,
      userId: user.subject,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("quirks"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    color: v.optional(v.string()),
    attributes: v.optional(v.array(quirkAttributeValidator)),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("Unauthorized");
    }

    const quirk = await ctx.db.get(args.id);
    if (!quirk || quirk.userId !== user.subject) {
      throw new Error("Quirk not found or unauthorized");
    }

    const updates: Record<string, any> = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.description !== undefined) updates.description = args.description;
    if (args.color !== undefined) updates.color = args.color;
    if (args.attributes !== undefined) updates.attributes = args.attributes;

    await ctx.db.patch(args.id, updates);
    return null;
  },
});

export const remove = mutation({
  args: {
    id: v.id("quirks"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("Unauthorized");
    }

    const quirk = await ctx.db.get(args.id);
    if (!quirk || quirk.userId !== user.subject) {
      throw new Error("Quirk not found or unauthorized");
    }

    await ctx.db.delete(args.id);
    return null;
  },
});
