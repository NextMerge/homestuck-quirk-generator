import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { COLLECTION_COUNT_MAX } from "./limits";
import { convertToSlug } from "@/lib/slugify";

export const list = query({
  args: {
    usernameSlug: v.string(),
  },
  returns: v.object({
    collections: v.array(
      v.object({
        _id: v.id("collections"),
        name: v.string(),
        description: v.string(),
        order: v.number(),
      }),
    ),
    collectionBelongsToUser: v.boolean(),
  }),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    const user = await ctx.db
      .query("users")
      .withIndex("by_username_slug", (q) =>
        q.eq("usernameSlug", args.usernameSlug),
      )
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const collections = await ctx.db
      .query("collections")
      .withIndex("by_user_and_order", (q) => q.eq("userId", user.clerkId))
      .order("asc")
      .collect();

    return {
      collections: collections.map((collection) => ({
        _id: collection._id,
        name: collection.name,
        description: collection.description,
        order: collection.order,
      })),
      collectionBelongsToUser: identity?.subject === user.clerkId,
    };
  },
});

export const get = query({
  args: {
    usernameSlug: v.string(),
    collectionSlug: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    const user = await ctx.db
      .query("users")
      .withIndex("by_username_slug", (q) =>
        q.eq("usernameSlug", args.usernameSlug),
      )
      .unique();

    if (!user) {
      return null;
    }

    const collections = await ctx.db
      .query("collections")
      .withIndex("by_user", (q) => q.eq("userId", user.clerkId))
      .collect();

    // Find collection by matching slug
    const collection = collections.find(c => 
      convertToSlug(c.name) === args.collectionSlug
    );

    if (!collection) {
      return null;
    }
    
    const quirks = await ctx.db
      .query("quirks")
      .withIndex("by_collection_and_order", (q) =>
        q.eq("collectionId", collection._id),
      )
      .order("asc")
      .collect();

    return {
      _id: collection._id,
      name: collection.name,
      description: collection.description,
      order: collection.order,
      collectionBelongsToUser: identity?.subject === user.clerkId,
      quirks,
    };
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
  },
  returns: v.id("collections"),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const existingCollection = await ctx.db
      .query("collections")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .filter((q) => q.eq(q.field("name"), args.name))
      .unique();

    if (existingCollection) {
      throw new Error("Collection with this name already exists");
    }

    // Get the highest order value for this user to append to the end
    const userCollections = await ctx.db
      .query("collections")
      .withIndex("by_user_and_order", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .collect();

    if (userCollections.length >= COLLECTION_COUNT_MAX) {
      throw new Error("You have reached the maximum number of collections");
    }

    const lastCollection = userCollections[0] ?? null;

    const nextOrder = lastCollection ? lastCollection.order + 1 : 0;

    return await ctx.db.insert("collections", {
      name: args.name.trim(),
      description: args.description.trim(),
      order: nextOrder,
      userId: identity.subject,
    });
  },
});

// Reorder collections for a user
export const reorder = mutation({
  args: {
    collectionId: v.id("collections"),
    newOrder: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const collection = await ctx.db.get(args.collectionId);
    if (!collection || collection.userId !== identity.subject) {
      throw new Error("Collection not found or unauthorized");
    }

    const oldOrder = collection.order;
    const newOrder = args.newOrder;

    if (oldOrder === newOrder) {
      return null; // No change needed
    }

    // Get all collections for this user
    const allCollections = await ctx.db
      .query("collections")
      .withIndex("by_user_and_order", (q) => q.eq("userId", identity.subject))
      .collect();

    // Update the target collection first
    await ctx.db.patch(args.collectionId, { order: newOrder });

    // Shift other collections as needed
    if (oldOrder < newOrder) {
      // Moving down: shift items between oldOrder+1 and newOrder up by 1
      for (const otherCollection of allCollections) {
        if (
          otherCollection._id !== args.collectionId &&
          otherCollection.order > oldOrder &&
          otherCollection.order <= newOrder
        ) {
          await ctx.db.patch(otherCollection._id, {
            order: otherCollection.order - 1,
          });
        }
      }
    } else {
      // Moving up: shift items between newOrder and oldOrder-1 down by 1
      for (const otherCollection of allCollections) {
        if (
          otherCollection._id !== args.collectionId &&
          otherCollection.order >= newOrder &&
          otherCollection.order < oldOrder
        ) {
          await ctx.db.patch(otherCollection._id, {
            order: otherCollection.order + 1,
          });
        }
      }
    }

    return null;
  },
});

export const update = mutation({
  args: {
    collectionId: v.id("collections"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const collection = await ctx.db.get(args.collectionId);
    if (!collection || collection.userId !== identity.subject) {
      throw new Error("Collection not found or unauthorized");
    }

    const updates: { name?: string; description?: string } = {};
    if (args.name !== undefined) {
      updates.name = args.name;
    }
    if (args.description !== undefined) {
      updates.description = args.description;
    }

    await ctx.db.patch(args.collectionId, updates);
    return null;
  },
});

export const deleteCollection = mutation({
  args: {
    collectionId: v.id("collections"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const collection = await ctx.db.get(args.collectionId);
    if (!collection || collection.userId !== identity.subject) {
      throw new Error("Collection not found or unauthorized");
    }

    // Delete the collection
    await ctx.db.delete(args.collectionId);

    // Reorder remaining collections to fill the gap
    const remainingCollections = await ctx.db
      .query("collections")
      .withIndex("by_user_and_order", (q) => q.eq("userId", identity.subject))
      .filter((q) => q.gt(q.field("order"), collection.order))
      .collect();

    // Shift all collections with higher order down by 1
    for (const otherCollection of remainingCollections) {
      await ctx.db.patch(otherCollection._id, {
        order: otherCollection.order - 1,
      });
    }

    return null;
  },
});
