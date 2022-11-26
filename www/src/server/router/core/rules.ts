import { RulesEnum } from '@utils/compiler'
import { z } from 'zod'
import { createProtectedRouter } from '../context'

/**
 * Rules Router
 * Any TraitElement Rules functionality should implemented here.
 *
 */
export const rulesRouter = createProtectedRouter()
  /**
   * Creates a Rule with two associated TraitElements and a "condition" based on the compiler's supported conditions.
   */
  .mutation('create', {
    input: z.object({
      condition: RulesEnum,
      traitElements: z.tuple([z.string(), z.string()]),
    }),
    async resolve({ ctx, input }) {
      const { condition, traitElements } = input
      return await ctx.prisma.rules.create({
        data: { condition, primaryTraitElementId: traitElements[0], secondaryTraitElementId: traitElements[1] },
      })
    },
  })
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
