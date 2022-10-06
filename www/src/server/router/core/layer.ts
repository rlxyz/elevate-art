import { z } from 'zod'
import { createRouter } from '../context'

export const layerElementRouter = createRouter()
  .mutation('reorderMany', {
    input: z.object({
      layerIdsInOrder: z.array(z.string()),
    }),
    async resolve({ ctx, input }) {
      await ctx.prisma.$transaction(
        async (tx) => {
          await Promise.all(
            input.layerIdsInOrder.map(async (layerId, index) => {
              await tx.layerElement.update({
                where: { id: layerId },
                data: { priority: index },
              })
            })
          )
        },
        {
          maxWait: 5000,
          timeout: 10000,
        }
      )
    },
  })
  .mutation('createManyTrait', {
    input: z.object({
      layerElementId: z.string(),
      traitNames: z.array(z.string()),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.traitElement.createMany({
        data: input.traitNames.map((name) => {
          return { name, layerElementId: input.layerElementId, weight: 1 }
        }),
      })
    },
  })
