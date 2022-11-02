import { z } from 'zod'
import { createRouter } from '../context'

export const layerElementRouter = createRouter()
  .query('getAll', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.layerElement.findMany({
        where: {
          repositoryId: input.id,
        },
        orderBy: [{ priority: 'asc' }, { name: 'asc' }],
        include: {
          traitElements: {
            orderBy: [{ weight: 'asc' }, { name: 'asc' }],
            include: {
              rulesPrimary: {
                orderBy: [{ condition: 'asc' }, { primaryTraitElement: { name: 'asc' } }],
                include: {
                  primaryTraitElement: true,
                  secondaryTraitElement: true,
                },
              },
              rulesSecondary: {
                orderBy: [{ condition: 'asc' }, { primaryTraitElement: { name: 'asc' } }],
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
  .mutation('reorder', {
    input: z.object({
      layerElementOrder: z.array(z.string()),
    }),
    async resolve({ ctx, input }) {
      await ctx.prisma.$transaction(
        async (tx) => {
          await Promise.all(
            input.layerElementOrder.map(async (layerId, index) => {
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
  .mutation('weight.update', {
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
      return await Promise.all(
        input.traits.map(async ({ id, weight }) => {
          return await ctx.prisma.traitElement.update({
            where: {
              id,
            },
            data: {
              weight,
            },
          })
        })
      )
    },
  })
