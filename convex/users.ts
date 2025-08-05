import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";
import { convertToSlug } from "@/lib/slugify";

export const getUserByClerkId = internalQuery({
  args: {
    clerkId: v.string(),
  },
  returns: v.union(
    v.object({
      _id: v.id("users"),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    return user ? { _id: user._id } : null;
  },
});

export const updateOrCreateUser = internalMutation({
  args: {
    username: v.string(),
    clerkId: v.string(),
  },
  returns: v.id("users"),
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (existingUser) {
      // Update existing user
      await ctx.db.patch(existingUser._id, {
        username: args.username,
        usernameSlug: convertToSlug(args.username),
      });
      return existingUser._id;
    } else {
      // Check if username is already taken
      const userWithUsername = await ctx.db
        .query("users")
        .withIndex("by_username", (q) => q.eq("username", args.username))
        .unique();

      if (userWithUsername) {
        throw new Error("Username already taken");
      }

      // Create new user
      return await ctx.db.insert("users", {
        clerkId: args.clerkId,
        username: args.username,
        usernameSlug: convertToSlug(args.username),
      });
    }
  },
});

export const getUserByUsername = internalQuery({
  args: {
    username: v.string(),
  },
  returns: v.object({
    clerkId: v.string(),
  }),
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .unique();

    if (!user) {
      throw Error("User not found");
    }

    return {
      clerkId: user.clerkId,
    };
  },
});
