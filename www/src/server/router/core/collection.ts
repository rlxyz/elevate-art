import { z } from 'zod'
import { createRouter } from '../context'

export const collectionRouter = createRouter()
  .mutation('create', {
    input: z.object({
      repositoryId: z.string(),
      name: z.string(),
      totalSupply: z.number(),
    }),
    async resolve({ ctx, input }) {
      const { repositoryId, name, totalSupply } = input
      return await ctx.prisma.collection.create({ data: { name, repositoryId, totalSupply } })
    },
  })
  .mutation('updateGeneration', {
    input: z.object({ id: z.string() }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.collection.update({
        where: { id: input.id },
        data: { generations: { increment: 1 } },
      })
    },
  })
