import { RulesEnum } from '@utils/compiler'
import { z } from 'zod'
import { createProtectedRouter } from '../context'

export const rulesRouter = createProtectedRouter()
  .mutation('delete', {
    input: z.object({
      condition: RulesEnum,
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
  .mutation('create', {
    input: z.object({
      condition: RulesEnum,
      primaryLayerElementId: z.string(),
      primaryTraitElementId: z.string(),
      secondaryLayerElementId: z.string(),
      secondaryTraitElementId: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.rules.create({
        data: {
          condition: input.condition,
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
