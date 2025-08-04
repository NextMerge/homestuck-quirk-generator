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
    collectionId: v.id("collections"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("Unauthorized");
    }

    // First verify the collection belongs to the user
    const collection = await ctx.db.get(args.collectionId);
    if (!collection || collection.userId !== user.tokenIdentifier) {
      throw new Error("Collection not found or unauthorized");
    }

    const quirks = await ctx.db
      .query("quirks")
      .withIndex("by_collection_and_order", (q) =>
        q.eq("collectionId", args.collectionId),
      )
      .order("asc")
      .collect();

    return quirks;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    color: v.string(),
    collectionId: v.id("collections"),
    attributes: v.array(quirkAttributeValidator),
  },
  returns: v.id("quirks"),
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("Unauthorized");
    }

    // Verify the collection belongs to the user
    const collection = await ctx.db.get(args.collectionId);
    if (!collection || collection.userId !== user.tokenIdentifier) {
      throw new Error("Collection not found or unauthorized");
    }

    // Get the highest order value for this collection to append to the end
    const lastQuirk = await ctx.db
      .query("quirks")
      .withIndex("by_collection_and_order", (q) =>
        q.eq("collectionId", args.collectionId),
      )
      .order("desc")
      .first();

    const nextOrder = lastQuirk ? lastQuirk.order + 1 : 0;

    return await ctx.db.insert("quirks", {
      name: args.name,
      description: args.description,
      color: args.color,
      order: nextOrder,
      collectionId: args.collectionId,
      attributes: args.attributes,
      userId: user.tokenIdentifier,
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
    if (!quirk || quirk.userId !== user.tokenIdentifier) {
      throw new Error("Quirk not found or unauthorized");
    }

    const updates: Record<string, unknown> = {};
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
    if (!quirk || quirk.userId !== user.tokenIdentifier) {
      throw new Error("Quirk not found or unauthorized");
    }

    await ctx.db.delete(args.id);
    return null;
  },
});

// Reorder quirks within a collection
export const reorder = mutation({
  args: {
    quirkId: v.id("quirks"),
    newOrder: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("Unauthorized");
    }

    const quirk = await ctx.db.get(args.quirkId);
    if (!quirk || quirk.userId !== user.tokenIdentifier) {
      throw new Error("Quirk not found or unauthorized");
    }

    const oldOrder = quirk.order;
    const newOrder = args.newOrder;

    if (oldOrder === newOrder) {
      return null; // No change needed
    }

    // Get all quirks in the same collection
    const allQuirks = await ctx.db
      .query("quirks")
      .withIndex("by_collection_and_order", (q) =>
        q.eq("collectionId", quirk.collectionId),
      )
      .collect();

    // Update the target quirk first
    await ctx.db.patch(args.quirkId, { order: newOrder });

    // Shift other quirks as needed
    if (oldOrder < newOrder) {
      // Moving down: shift items between oldOrder+1 and newOrder up by 1
      for (const otherQuirk of allQuirks) {
        if (
          otherQuirk._id !== args.quirkId &&
          otherQuirk.order > oldOrder &&
          otherQuirk.order <= newOrder
        ) {
          await ctx.db.patch(otherQuirk._id, { order: otherQuirk.order - 1 });
        }
      }
    } else {
      // Moving up: shift items between newOrder and oldOrder-1 down by 1
      for (const otherQuirk of allQuirks) {
        if (
          otherQuirk._id !== args.quirkId &&
          otherQuirk.order >= newOrder &&
          otherQuirk.order < oldOrder
        ) {
          await ctx.db.patch(otherQuirk._id, { order: otherQuirk.order + 1 });
        }
      }
    }

    return null;
  },
});
