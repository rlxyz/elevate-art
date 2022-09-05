import { z } from 'zod'
import { createRouter } from './context'

export const getRepositoryByNameSchema = z.object({
  name: z.string(),
})

export const repositoryRouter = createRouter()
  .query('getRepositoryByName', {
    input: getRepositoryByNameSchema,
    async resolve({ ctx, input }) {
      return await ctx.prisma.repository.findFirst({
        where: { ...input },
        include: {
          layers: {
            orderBy: { priority: 'asc' }, // guarantee layer order correctness
            include: {
              traitElements: {
                orderBy: { weight: 'asc' }, // guarantee rarest first
                include: {
                  rulesPrimary: {
                    include: {
                      primaryTraitElement: {
                        include: {
                          layerElement: true,
                        },
                      },
                      secondaryTraitElement: {
                        include: {
                          layerElement: true,
                        },
                      },
                    },
                  },
                  rulesSecondary: {
                    include: {
                      primaryTraitElement: {
                        include: {
                          layerElement: true,
                        },
                      },
                      secondaryTraitElement: {
                        include: {
                          layerElement: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          collections: {
            where: { name: 'main' },
            select: { id: true },
            orderBy: { createdAt: 'asc' }, // get most recent updated organisation first
          },
        },
      })
    },
  })
  .query('getRepositoryLayers', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.layerElement.findMany({
        where: {
          repositoryId: input.id,
        },
      })
    },
  })
  .query('getRepositoryById', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.repository.findFirst({
        where: {
          ...input,
        },
      })
    },
  })
