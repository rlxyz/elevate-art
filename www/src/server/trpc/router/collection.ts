import { z } from 'zod'
import { createProtectedRouter } from '../../router/context'

export const collectionRouter = createProtectedRouter()
  .query('getAll', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { id } = input
      return await ctx.prisma.collection.findMany({
        where: { repositoryId: id },
        orderBy: [{ createdAt: 'asc' }, { name: 'asc' }],
      })
    },
  })
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
  .mutation('generation.increment', {
    input: z.object({ id: z.string() }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.collection.update({
        where: { id: input.id },
        data: { generations: { increment: 1 } },
      })
    },
  })
