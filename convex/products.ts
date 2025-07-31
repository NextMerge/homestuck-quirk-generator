import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("products"),
      _creationTime: v.number(),
      title: v.string(),
      imageId: v.string(),
      price: v.number(),
    }),
  ),
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    const products = await ctx.db.query("products").collect();
    const [firstProduct] = products;
    if (user) {
      return [
        {
          _id: firstProduct._id,
          _creationTime: 0,
          title: user.name ?? user.email ?? user.subject,
          imageId: "",
          price: 69,
        },
        ...products,
      ];
    }
    return [
      {
        _id: firstProduct._id,
        _creationTime: 0,
        title: "Guest",
        imageId: "",
        price: 69,
      },
      ...products,
    ];
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    imageId: v.string(),
    price: v.number(),
  },
  returns: v.id("products"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("products", {
      title: args.title,
      imageId: args.imageId,
      price: args.price,
    });
  },
});
