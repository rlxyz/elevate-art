import { z } from 'zod'
import { protectedProcedure, router } from '../trpc'

/**
 * Repository Router
 * Any Repository functionality should implemented here.
 *
 * @todo protect this router by checking if the user is the owner of the repository
 */
export const repositoryRouter = router({
  findByName: protectedProcedure
    .input(
      z.object({
        repositoryName: z.string(),
        organisationName: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { repositoryName: r, organisationName: o } = input
      return await ctx.prisma.repository.findFirst({ where: { name: r, organisation: { name: o } } })
    }),
  create: protectedProcedure
    .input(
      z.object({
        organisationId: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, organisationId } = input
      return await ctx.prisma.repository.create({
        data: {
          organisationId,
          name,
          tokenName: name,
          collections: {
            create: {
              name: 'main',
              totalSupply: 10000,
              type: 'default', // when collection created, it is default branch
            },
          },
        },
        include: {
          collections: true,
        },
      })
    }),
})
