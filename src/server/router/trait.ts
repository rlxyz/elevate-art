import { createRouter } from './context'
import { z } from 'zod'
export const traitElementRouter = createRouter()
  .mutation('updateWeightMany', {
    input: z.object({
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
    },
  })
  .mutation('setRuleById', {
    input: z.object({
      id: z.string(),
      type: z.string(),
      linkedTraitElementId: z.string(),
    }),
    async resolve({ ctx, input }) {
      await ctx.prisma.rules.create({
        data: {
          condition: input.type,
          primaryTraitElementId: input.id,
          secondaryTraitElementId: input.linkedTraitElementId,
        },
      })
    },
  })
  .mutation('deleteRuleById', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      await ctx.prisma.rules.deleteMany({
        where: {
          primaryTraitElementId: input.id,
        },
      })
    },
  })
  .query('getTraitManyByLayerElementId', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      return ctx.prisma.traitElement.findMany({
        where: {
          layerElementId: input.id,
        },
      })
    },
  })
