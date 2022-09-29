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
      await ctx.prisma.layerElement.createMany({
        data: input.layers.map(({ layerName: name }, index) => {
          return {
            name,
            repositoryId: input.repositoryId,
            priority: index,
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
          include: {
            layerElement: true,
          },
        })
      })
    },
  })
  .mutation('reorder', {
    input: z.object({
      layerIdsInOrder: z.array(z.string()),
      repositoryId: z.string(),
    }),
    async resolve({ ctx, input }) {
      return Promise.all(
        input.layerIdsInOrder.map(async (layerId, index) => {
          return await ctx.prisma.layerElement.update({
            where: {
              id: layerId,
            },
            data: {
              priority: index,
            },
          })
        })
      )
    },
  })
