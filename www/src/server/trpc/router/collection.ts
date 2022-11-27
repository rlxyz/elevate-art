import { z } from 'zod'
import { protectedProcedure, router } from '../trpc'

/**
 * Collection Router
 * Any Collection functionality should implemented here.
 *
 * @todo protect this router by checking if the user is the owner of the repository
 */
export const collectionRouter = router({
  findAll: protectedProcedure
    .input(
      z.object({
        repositoryId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { repositoryId } = input
      return await ctx.prisma.collection.findMany({
        where: { repositoryId },
        orderBy: [{ createdAt: 'asc' }, { name: 'asc' }],
      })
    }),
  create: protectedProcedure
    .input(
      z.object({
        repositoryId: z.string(),
        name: z.string(),
        totalSupply: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { repositoryId, name, totalSupply } = input
      return await ctx.prisma.collection.create({ data: { name, repositoryId, totalSupply } })
    }),
  updateGeneration: protectedProcedure
    .input(
      z.object({
        collectionId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { collectionId } = input
      return await ctx.prisma.collection.update({
        where: { id: collectionId },
        data: { generations: { increment: 1 } },
      })
    }),
})
