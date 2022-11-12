import { z } from 'zod'
import { createRouter } from '../context'

/**
 * LayerElement Router
 * Any LayerElement functionality should implemented here.
 */
export const layerElementRouter = createRouter()
  /**
   * Get All LayerElements based on their associated repository id.
   * Also, returns the associated TraitElements & Rules.
   *
   * @todo break this up so TraitElements & Rules are fetched separately, its too
   *       much data to fetch at once. requires big restructuring of data fetch in app
   * @todo rename input id to repositoryId; not specific enough
   */
  .query('getAll', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { id: repositoryId } = input

      /** Fetch many LayerElement & TraitElements & Rules from Db */
      return await ctx.prisma.layerElement.findMany({
        where: { repositoryId },
        orderBy: [{ priority: 'asc' }, { name: 'asc' }],
        include: {
          traitElements: {
            orderBy: [{ weight: 'desc' }, { name: 'asc' }],
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
  /**
   * Create LayerElement with their associated repository id.
   * This function is NOT dynamic. It only allows a single LayerElement to be created.
   * It also created all associated TraitElements.
   *
   * @todo make this more dynamic so it can create multiple LayerElements at once.
   */
  .mutation('create', {
    input: z.object({
      repositoryId: z.string(),
      name: z.string(),
      traitElements: z.array(z.object({ name: z.string() })),
    }),
    async resolve({ ctx, input }) {
      const { repositoryId, name, traitElements } = input

      /** Create LayerElement & TraitElements in Db */
      return await ctx.prisma.layerElement.create({
        data: {
          repositoryId,
          name,
          traitElements: {
            createMany: {
              data: traitElements.map(({ name }) => ({ name, weight: 1 })),
            },
          },
        },
        include: {
          traitElements: true,
        },
      })
    },
  })
  .query('traits.find', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { id } = input
      return await ctx.prisma.layerElement.findFirst({
        where: {
          id,
        },
        select: { traitElements: true },
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
