import { createRouter } from './context'
import { z } from 'zod'

export const collectionRouter = createRouter()
  .mutation('incrementGeneration', {
    input: z.object({ id: z.string() }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.collection.update({
        where: { id: input.id },
        data: { generations: { increment: 1 } },
      })
    },
  })
  .query('getCollectionById', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      return ctx.prisma.collection.findFirst({
        where: {
          id: input.id,
        },
      })
    },
  })
