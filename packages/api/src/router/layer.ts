import { z } from 'zod'
import { createRouter } from '../context'

export const layerElementRouter = createRouter().mutation('reorderMany', {
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
