import { Prisma } from '@prisma/client'
import { deleteImageFolderFromCloudinary, DeleteTraitElementResponse } from '@server/scripts/cld-delete-image'
import * as trpc from '@trpc/server'
import { Result } from '@utils/result'
import { z } from 'zod'
import { createRouter } from '../context'

const LayerElementUpdateNameInput = z.array(z.object({ name: z.string(), layerElementId: z.string(), repositoryId: z.string() }))

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
        orderBy: [{ priority: 'asc' }],
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
    }),
    async resolve({ ctx, input }) {
      const { repositoryId, name } = input

      /** Infer current count as priority */
      const count = await ctx.prisma.layerElement.count({ where: { repositoryId } })

      /** Create LayerElement & TraitElements in Db */
      try {
        return await ctx.prisma.layerElement.create({
          data: {
            repositoryId,
            name,
            priority: count,
          },
        })
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === 'P2002') {
            /** Unique constaint error! */
            throw new trpc.TRPCError({
              code: `BAD_REQUEST`,
              message:
                'A LayerElement with that name already exists in this repository. Please choose a different name and try again.',
            })
          }
        }
        throw e
      }
    },
  })
  /**
   * Delete LayerElement with their associated repository id.
   * This function is NOT dynamic. It only allows a single LayerElement to be created.
   * It also created all associated TraitElements.
   *
   * @todo make this more dynamic so it can create multiple LayerElements at once.
   */
  .mutation('delete', {
    input: z.object({
      repositoryId: z.string(),
      layerElementId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { layerElementId, repositoryId } = input

      /* Delete many TraitElement from Cloudinary */
      /** @todo if any item in DeleteFolderResponse is not boolean true, then what? */
      const response: Result<DeleteTraitElementResponse[]> = await deleteImageFolderFromCloudinary({
        r: repositoryId,
        l: layerElementId,
      })

      /** Return if failed */
      if (response.failed) {
        throw new trpc.TRPCError({
          code: `INTERNAL_SERVER_ERROR`,
          message: response.error,
        })
      }

      /** Run Delete atomically */
      return await ctx.prisma.$transaction(
        async (tx) => {
          /* Delete many TraitElement from Db  */
          await tx.traitElement.deleteMany({ where: { layerElementId } })

          /** Create LayerElement & TraitElements in Db */
          const layerElement = await tx.layerElement.delete({
            where: {
              id: layerElementId,
            },
          })

          /** Update priority of all other LayerElements */
          await tx.layerElement.updateMany({
            where: {
              repositoryId,
              priority: {
                gte: layerElement.priority,
              },
            },
            data: {
              priority: {
                decrement: 1,
              },
            },
          })

          return layerElement
        },
        { maxWait: 5000, timeout: 10000 }
      )
    },
  })
  /**
   * Renames a TraitElement with their associated LayerElement.
   * This function is dynamic in that it allows a non-sorted list of TraitElements with different associated LayerElements.
   */
  .mutation('update.name', {
    input: z.object({
      layerElements: LayerElementUpdateNameInput.min(1),
    }),
    async resolve({ ctx, input }) {
      const { layerElements } = input

      /* Update many traits based on their traitElementId & name */
      await ctx.prisma.$transaction(async (tx) => {
        await Promise.all(
          layerElements.map(async ({ layerElementId: id, name }) => {
            await tx.layerElement.update({
              where: { id },
              data: { name },
            })
          })
        )
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
  /**
   * @todo update to serializable tx
   */
  .mutation('update.order', {
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
