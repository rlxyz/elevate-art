import { Prisma } from '@prisma/client'
import { deleteImageFolderFromCloudinary, DeleteTraitElementResponse } from '@server/common/cld-delete-image'
import { updateManyByField } from '@server/utils/prisma-utils'
import { Result } from '@server/utils/response-result'
import { TRPCError } from '@trpc/server'
import Big from 'big.js'
import { z } from 'zod'
import { protectedProcedure, router } from '../trpc'

const LayerElementUpdateNameInput = z.array(z.object({ name: z.string(), layerElementId: z.string(), repositoryId: z.string() }))
const LayerElementUpdateOrderInput = z.array(z.object({ priority: z.number(), layerElementId: z.string() }))
/**
 * LayerElement Router
 * Any LayerElement functionality should implemented here.
 */
export const layerElementRouter = router({
  /**
   * Get All LayerElements based on their associated repository id.
   * Also, returns the associated TraitElements & Rules.
   *
   * @todo break this up so TraitElements & Rules are fetched separately, its too
   *       much data to fetch at once. requires big restructuring of data fetch in app
   * @todo rename input id to repositoryId; not specific enough
   */
  findAll: protectedProcedure
    .input(
      z.object({
        repositoryId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { repositoryId } = input

      /** Fetch many LayerElement & TraitElements & Rules from Db */
      return await ctx.prisma.layerElement.findMany({
        where: { repositoryId },
        orderBy: [{ priority: 'asc' }],
        include: {
          traitElements: {
            orderBy: [{ weight: 'desc' }, { name: 'asc' }],
            include: {
              rulesPrimary: { orderBy: [{ condition: 'asc' }, { primaryTraitElement: { name: 'asc' } }] },
              rulesSecondary: { orderBy: [{ condition: 'asc' }, { primaryTraitElement: { name: 'asc' } }] },
            },
          },
        },
      })
    }),
  /**
   * Create LayerElement with their associated repository id.
   * This function is NOT dynamic. It only allows a single LayerElement to be created.
   * It also created all associated TraitElements.
   *
   * @todo make this more dynamic so it can create multiple LayerElements at once.
   */
  create: protectedProcedure
    .input(
      z.object({
        repositoryId: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
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
            throw new TRPCError({
              code: `BAD_REQUEST`,
              message: 'A LayerElement with that name already exists in this repository. Please choose a different name and try again.',
            })
          }
        }
        throw e
      }
    }),
  createMany: protectedProcedure
    .input(
      z.object({
        repositoryId: z.string(),
        layerElements: z.array(z.object({ name: z.string(), traitElements: z.array(z.object({ name: z.string() })) })),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { repositoryId, layerElements } = input

      /** Infer current index as priority */
      await ctx.prisma.layerElement.createMany({
        data: layerElements.map(({ name, traitElements }, index) => ({
          repositoryId,
          name,
          priority: index,
          traitElements: {
            create: {
              data: traitElements.map(({ name }) => ({ name, weight: Big(1).div(traitElements.length).mul(100).toNumber() })),
            },
          },
        })),
      })

      // layers: {
      //   create: layerElements.map(({ name, traitElements }, index) => ({
      //     name,
      //     priority: index,
      //     traitElements: {
      //       createMany: {
      //         data: traitElements.map(({ name }) => ({ name, weight: Big(1).div(traitElements.length).mul(100).toNumber() })),
      //       },
      //     },
      //   })),
      // },

      return await ctx.prisma.layerElement.findMany({
        where: { repositoryId },
        orderBy: [{ priority: 'asc' }],
        include: {
          traitElements: true,
        },
      })
    }),
  /**
   * Delete LayerElement with their associated repository id.
   * This function is NOT dynamic. It only allows a single LayerElement to be created.
   * It also created all associated TraitElements.
   *
   * @todo make this more dynamic so it can create multiple LayerElements at once.
   */
  delete: protectedProcedure
    .input(
      z.object({
        repositoryId: z.string(),
        layerElementId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { layerElementId, repositoryId } = input

      /* Delete many TraitElement from Cloudinary */
      /** @todo if any item in DeleteFolderResponse is not boolean true, then what? */
      const response: Result<DeleteTraitElementResponse[]> = await deleteImageFolderFromCloudinary({
        r: repositoryId,
        l: layerElementId,
      })

      /** Return if failed */
      if (response.failed) {
        throw new TRPCError({
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
    }),
  /**
   * Renames a TraitElement with their associated LayerElement.
   * This function is dynamic in that it allows a non-sorted list of TraitElements with different associated LayerElements.
   */
  updateName: protectedProcedure
    .input(
      z.object({
        layerElements: LayerElementUpdateNameInput.min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
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
    }),
  /**
   * Updates priority of each LayerElement with their associated LayerElement.
   */
  updateOrder: protectedProcedure
    .input(
      z.object({
        layerElements: LayerElementUpdateOrderInput.min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
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
        throw new TRPCError({
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
        throw new TRPCError({
          code: `BAD_REQUEST`,
          message: 'User doesnt have access to this repository. Please try again.',
        })
      }

      /** Ensure the number of items being changed is the same as the number of items in the Db */
      await prisma.$transaction(async (tx) => {
        const total = await tx.layerElement.count({ where: { repositoryId } })
        if (total !== _count) {
          throw new TRPCError({
            code: `BAD_REQUEST`,
            message: 'Invalid input. Please try again.',
          })
        }

        /** Update priority of each LayerElement */
        await updateManyByField(tx, 'LayerElement', 'priority', layerElements, (x) => [x.layerElementId, x.priority + 100]) // @todo fix
        await updateManyByField(tx, 'LayerElement', 'priority', layerElements, (x) => [x.layerElementId, x.priority])
      })
    }),
})
