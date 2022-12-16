import Big from 'big.js'
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
        layerElements: z.array(z.object({ name: z.string(), traitElements: z.array(z.object({ name: z.string() })) })),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, organisationId, layerElements } = input
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
          layers: {
            create: layerElements.map(({ name, traitElements }, index) => ({
              name,
              priority: index,
              traitElements: {
                createMany: {
                  data: traitElements.map(({ name }) => ({ name, weight: Big(1).div(traitElements.length).mul(100).toNumber() })),
                },
              },
            })),
          },
        },
        include: {
          collections: true,
          layers: {
            include: {
              traitElements: true,
            },
          },
        },
      })
    }),
})
