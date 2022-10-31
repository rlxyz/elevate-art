import { deleteImageFromCloudinary } from '@server/common/cld-delete-image'
import { z } from 'zod'
import { createRouter } from '../context'

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
  .mutation('deleteMany', {
    input: z.object({
      traitElements: z.array(z.object({ id: z.string(), layerElementId: z.string(), repositoryId: z.string() })),
    }),
    async resolve({ ctx, input }) {
      const { traitElements } = input
      await ctx.prisma.traitElement.deleteMany({
        where: {
          id: {
            in: traitElements.map((x) => x.id),
          },
        },
      })
      await Promise.all(
        traitElements.map(
          async ({ repositoryId: r, layerElementId: l, id: t }) =>
            await deleteImageFromCloudinary({
              r,
              l,
              t,
            })
        )
      )
    },
  })
  .mutation('createMany', {
    input: z.object({
      layerElementId: z.string(),
      traitElements: z.array(z.string()),
    }),
    async resolve({ ctx, input }) {
      await ctx.prisma.traitElement.createMany({
        data: input.traitElements.map((name) => ({
          layerElementId: input.layerElementId,
          name,
        })),
      })

      return ctx.prisma.traitElement.findMany({
        where: {
          layerElementId: input.layerElementId,
        },
        include: {
          rulesPrimary: {
            include: {
              primaryTraitElement: true,
              secondaryTraitElement: true,
            },
          },
          rulesSecondary: {
            include: {
              primaryTraitElement: true,
              secondaryTraitElement: true,
            },
          },
        },
      })
    },
  })
