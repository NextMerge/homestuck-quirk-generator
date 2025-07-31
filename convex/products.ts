import { query, mutation } from './_generated/server'
import { v } from 'convex/values'

export const get = query({
  args: {},
  returns: v.array(v.object({
    _id: v.id('products'),
    _creationTime: v.number(),
    title: v.string(),
    imageId: v.string(),
    price: v.number(),
  })),
  handler: async (ctx) => {
    return await ctx.db.query('products').collect()
  },
})

export const create = mutation({
  args: {
    title: v.string(),
    imageId: v.string(),
    price: v.number(),
  },
  returns: v.id('products'),
  handler: async (ctx, args) => {
    return await ctx.db.insert('products', {
      title: args.title,
      imageId: args.imageId,
      price: args.price,
    })
  },
})
