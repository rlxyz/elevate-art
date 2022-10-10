import { z } from 'zod'
import { createProtectedRouter } from '../context'

export const traitElementRouter = createProtectedRouter()
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
  .mutation('setNameById', {
    input: z.object({
      repositoryId: z.string(),
      id: z.string(),
      oldName: z.string(),
      newName: z.string(),
    }),
    async resolve({ ctx, input }) {
      await ctx.prisma.traitElement.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.newName,
        },
      })

      return {
        layers: await ctx.prisma.layerElement.findMany({
          where: {
            repositoryId: input.repositoryId,
          },
          orderBy: { priority: 'asc' },
          include: {
            traitElements: {
              orderBy: { weight: 'asc' }, // guarantee rarest first
              include: {
                rulesPrimary: {
                  include: {
                    primaryTraitElement: {
                      include: {
                        layerElement: true,
                      },
                    },
                    secondaryTraitElement: {
                      include: {
                        layerElement: true,
                      },
                    },
                  },
                },
                rulesSecondary: {
                  include: {
                    primaryTraitElement: {
                      include: {
                        layerElement: true,
                      },
                    },
                    secondaryTraitElement: {
                      include: {
                        layerElement: true,
                      },
                    },
                  },
                },
              },
            },
          },
        }),
      }
    },
  })
