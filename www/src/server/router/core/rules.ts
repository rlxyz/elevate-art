import { z } from 'zod'
import { createRouter } from '../context'

export const rulesRouter = createRouter()
  .mutation('delete', {
    input: z.object({
      primaryLayerElementId: z.string(),
      primaryTraitElementId: z.string(),
      secondaryLayerElementId: z.string(),
      secondaryTraitElementId: z.string(),
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.rules.delete({
        where: {
          id: input.id,
        },
      })
    },
  })
  // @todo: better naming conventions?
  .mutation('create', {
    input: z.object({
      type: z.string(),
      primaryLayerElementId: z.string(),
      primaryTraitElementId: z.string(),
      secondaryLayerElementId: z.string(),
      secondaryTraitElementId: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.rules.create({
        data: {
          condition: input.type,
          primaryTraitElementId: input.primaryTraitElementId,
          secondaryTraitElementId: input.secondaryTraitElementId,
        },
        include: {
          primaryTraitElement: true,
          secondaryTraitElement: true,
        },
      })
    },
  })
