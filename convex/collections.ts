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
      .withIndex("by_user", (q) => q.eq("userId", user.subject))
      .collect();

    return collections;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
  },
  returns: v.id("collections"),
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("Unauthorized");
    }

    const slugCandidate = slugify(args.name);

    const existingCollection = await ctx.db
      .query("collections")
      .withIndex("by_user_and_slug", (q) =>
        q.eq("userId", user.subject).eq("slug", slugCandidate),
      )
      .first();

    if (existingCollection) {
      throw new Error("Collection with this slug already exists");
    }

    return await ctx.db.insert("collections", {
      name: args.name,
      slug: slugCandidate,
      description: args.description,
      userId: user.subject,
    });
  },
});
