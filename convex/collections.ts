import { v } from "convex/values";
import slugify from "slugify";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("Unauthorized");
    }

    const collections = await ctx.db
      .query("collections")
      .withIndex("by_user_and_order", (q) =>
        q.eq("userId", user.tokenIdentifier),
      )
      .order("asc")
      .collect();

    return collections;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.string(),
  },
  returns: v.id("collections"),
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("Unauthorized");
    }

    const slugCandidate = args.slug;

    const existingCollection = await ctx.db
      .query("collections")
      .withIndex("by_slug", (q) => q.eq("slug", slugCandidate))
      .first();

    if (existingCollection) {
      throw new Error("Collection with this slug already exists");
    }

    // Get the highest order value for this user to append to the end
    const lastCollection = await ctx.db
      .query("collections")
      .withIndex("by_user_and_order", (q) =>
        q.eq("userId", user.tokenIdentifier),
      )
      .order("desc")
      .first();

    const nextOrder = lastCollection ? lastCollection.order + 1 : 0;

    return await ctx.db.insert("collections", {
      name: args.name,
      slug: slugCandidate,
      description: args.description,
      order: nextOrder,
      userId: user.tokenIdentifier,
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
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("Unauthorized");
    }

    const collection = await ctx.db.get(args.collectionId);
    if (!collection || collection.userId !== user.tokenIdentifier) {
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
      .withIndex("by_user_and_order", (q) =>
        q.eq("userId", user.tokenIdentifier),
      )
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
