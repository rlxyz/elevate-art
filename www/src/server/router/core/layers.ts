import { Prisma } from '@prisma/client'
import { deleteImageFolderFromCloudinary, DeleteTraitElementResponse } from '@server/scripts/cld-delete-image'
import { updateManyByField } from '@server/utils/prisma'
import * as trpc from '@trpc/server'
import { Result } from '@utils/result'
import { z } from 'zod'
import { createProtectedRouter } from '../context'

const LayerElementUpdateNameInput = z.array(z.object({ name: z.string(), layerElementId: z.string(), repositoryId: z.string() }))
const LayerElementUpdateOrderInput = z.array(z.object({ priority: z.number(), layerElementId: z.string() }))
/**
 * LayerElement Router
 * Any LayerElement functionality should implemented here.
 */
export const layerElementRouter = createProtectedRouter()
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

      /** Create LayerElement & TraitElements in Db */
      try {
        const count = await ctx.prisma.layerElement.count({ where: { repositoryId } })
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
                gt: layerElement.priority,
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
   * Updates priority of each LayerElement with their associated LayerElement.
   */
  .mutation('update.order', {
    input: z.object({
      layerElements: LayerElementUpdateOrderInput.min(1),
    }),
    async resolve({ ctx, input }) {
      const { layerElements } = input
      const { session, prisma } = ctx

      /** Check if there is an equal number of layerElements input to LayerElement in Db */
      const groupedLayerElements = await prisma.layerElement.groupBy({
        where: { id: { in: layerElements.map(({ layerElementId }) => layerElementId) } },
        by: ['repositoryId'],
        _count: true,
      })

      /** Ensure only a single Repository LayerElements are being changed at once. */
      if (groupedLayerElements.length !== 1 || groupedLayerElements[0] === undefined) {
        throw new trpc.TRPCError({
          code: `BAD_REQUEST`,
          message: 'Invalid input. Please try again.',
        })
      }

      /** Get the repository and count of items being changed */
      const { repositoryId, _count } = groupedLayerElements[0]

      /** Ensure user is in the repository */
      const repository = await prisma.organisationMember.findFirst({
        where: {
          userId: session.user.id,
          organisation: {
            repositories: {
              some: {
                id: repositoryId,
              },
            },
          },
        },
      })
      if (!repository) {
        throw new trpc.TRPCError({
          code: `BAD_REQUEST`,
          message: 'User doesnt have access to this repository. Please try again.',
        })
      }

      /** Ensure the number of items being changed is the same as the number of items in the Db */
      await prisma.$transaction(async (tx) => {
        const total = await tx.layerElement.count({ where: { repositoryId } })
        if (total !== _count) {
          throw new trpc.TRPCError({
            code: `BAD_REQUEST`,
            message: 'Invalid input. Please try again.',
          })
        }

        /** Update priority of each LayerElement */
        await updateManyByField(tx, 'LayerElement', 'priority', layerElements, (x) => [x.layerElementId, x.priority + 100]) // @todo fix
        await updateManyByField(tx, 'LayerElement', 'priority', layerElements, (x) => [x.layerElementId, x.priority])
      })
    },
  })
