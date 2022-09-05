import { z } from 'zod'
import { createRouter } from './context'
export const layerElementRouter = createRouter()
  .query('getLayerById', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      return ctx.prisma.layerElement.findFirst({
        where: {
          id: input.id,
        },
        include: {
          traitElements: {
            orderBy: { weight: 'asc' },
            include: {
              rulesPrimary: {
                include: {
                  primaryTraitElement: true,
                  secondaryTraitElement: true,
                },
              },
              rulesSecondary: {
                include: {
                  primaryTraitElement: true,
                  secondaryTraitElement: true,
                },
              },
            },
          },
        },
      })
    },
  })
  .mutation('setAllTraits', {
    input: z.object({
      layerId: z.string(),
      repositoryId: z.string(),
      traits: z.array(
        z.object({
          id: z.string(),
          weight: z.number(),
        })
      ),
    }),
    async resolve({ ctx, input }) {
      input.traits.forEach(async ({ id, weight }) => {
        console.log(id, weight)
        await ctx.prisma.traitElement.update({
          where: {
            id,
          },
          data: {
            weight,
          },
        })
      })
      return {
        changedLayer: await ctx.prisma.layerElement.findFirst({
          where: {
            id: input.layerId,
          },
          include: {
            traitElements: {
              orderBy: { weight: 'asc' },
              include: {
                rulesPrimary: {
                  include: {
                    primaryTraitElement: true,
                    secondaryTraitElement: true,
                  },
                },
                rulesSecondary: {
                  include: {
                    primaryTraitElement: true,
                    secondaryTraitElement: true,
                  },
                },
              },
            },
          },
        }),
        layers: await ctx.prisma.layerElement.findMany({
          where: {
            repositoryId: input.repositoryId,
          },
          orderBy: { priority: 'asc' },
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
        }),
      }
    },
  })
  .query('getAllTraits', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      return ctx.prisma.layerElement.findFirst({
        where: {
          id: input.id,
        },
        include: {
          traitElements: {
            orderBy: { weight: 'asc' },
          },
        },
      })
    },
  })
