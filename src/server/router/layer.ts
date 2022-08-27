import { createRouter } from './context'
import { z } from 'zod'
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
              rules: {
                orderBy: {
                  createdAt: 'desc',
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
