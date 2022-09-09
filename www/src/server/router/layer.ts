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
  .mutation('createMany', {
    input: z.object({
      layers: z.array(
        z.object({
          layerName: z.string(),
          traitNames: z.array(z.string()),
        })
      ),
      repositoryId: z.string(),
    }),
    async resolve({ ctx, input }) {
      // todo: should be wrapped in a transaction
      await ctx.prisma.layerElement.createMany({
        data: input.layers.map(({ layerName: name }) => {
          return {
            name,
            repositoryId: input.repositoryId,
          }
        }),
        skipDuplicates: true,
      })

      return Promise.all(
        input.layers.map(async (layer) => {
          const layerElement = await ctx.prisma.layerElement.findFirst({
            where: {
              name: layer.layerName,
              repositoryId: input.repositoryId,
            },
          })

          if (!layerElement) return ''

          await ctx.prisma.traitElement.createMany({
            data: layer.traitNames.map((name) => {
              return {
                name,
                layerElementId: layerElement.id,
                weight: 1,
              }
            }),
          })

          return layerElement.id
        })
      ).then(async (layerElementIds) => {
        return await ctx.prisma.traitElement.findMany({
          where: {
            layerElementId: { in: layerElementIds },
          },
        })
      })
    },
  })
