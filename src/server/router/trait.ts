import { z } from 'zod'
import { createRouter } from './context'
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
      type: z.string(),
      primaryTraitElementId: z.string(),
      secondaryTraitElementId: z.string(),
    }),
    async resolve({ ctx, input }) {
      await ctx.prisma.rules.create({
        data: {
          condition: input.type,
          primaryTraitElementId: input.primaryTraitElementId,
          secondaryTraitElementId: input.secondaryTraitElementId,
        },
      })
      return {
        primary: await ctx.prisma.traitElement.findFirst({
          where: {
            id: input.primaryTraitElementId,
          },
        }),
        secondary: await ctx.prisma.traitElement.findFirst({
          where: {
            id: input.secondaryTraitElementId,
          },
        }),
      }
    },
  })
  .mutation('deleteRuleById', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const data = await ctx.prisma.rules.findFirst({
        where: {
          primaryTraitElementId: input.id,
        },
        include: {
          primaryTraitElement: true,
          secondaryTraitElement: true,
        },
      })

      await ctx.prisma.rules.deleteMany({
        where: {
          primaryTraitElementId: input.id,
        },
      })

      return data
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
