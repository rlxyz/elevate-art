import { z } from 'zod'
import { createRouter } from '../context'

export const repositoryRouter = createRouter()
  .query('getRepositoryByName', {
    input: z.object({
      name: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.repository.findFirst({
        where: { ...input },
      })
    },
  })
  .mutation('create', {
    input: z.object({
      organisationId: z.string(),
      name: z.string(),
      layerElements: z.array(z.object({ name: z.string(), traitElements: z.array(z.object({ name: z.string() })) })),
    }),
    async resolve({ ctx, input }) {
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
                  data: traitElements.map(({ name }) => ({ name, weight: 1 })),
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
    },
  })
  .mutation('delete', {
    input: z.object({
      repositoryId: z.string(),
    }),
    async resolve({ ctx, input }) {
      await ctx.prisma.repository.delete({
        where: {
          id: input.repositoryId,
        },
      })
    },
  })
