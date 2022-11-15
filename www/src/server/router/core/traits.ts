import { Prisma } from '@prisma/client'
import { deleteImageFilesFromCloudinary, DeleteTraitElementResponse } from '@server/scripts/cld-delete-image'
import { getLayerElementsWithTraitElements } from '@server/scripts/get-layer-with-traits'
import * as trpc from '@trpc/server'
import { groupBy } from '@utils/object-utils'
import { Result } from '@utils/result'
import { z } from 'zod'
import { createRouter } from '../context'

const TraitElementDeleteInput = z.array(z.object({ id: z.string(), layerElementId: z.string(), repositoryId: z.string() }))
const TraitElementCreateInput = z.array(z.object({ name: z.string(), layerElementId: z.string(), repositoryId: z.string() }))
const TraitElementUpdateNameInput = z.array(z.object({ name: z.string(), traitElementId: z.string(), repositoryId: z.string() }))
const TraitElementUpdateWeightInput = z.array(
  z.object({ weight: z.number(), traitElementId: z.string(), layerElementId: z.string() })
)

/**
 * TraitElement Router
 * Any TraitElement functionality should implemented here.
 *
 * @note the "None" is not in the db. This allow us to dynamically update the current weight of the none trait by
 * summing up all TraitElements weights and subtracting it from 100. This is done at client-side. One of the advantages,
 * is that we don't have to update the 'None' TraitElement everytime another TraitElement is updated. For e.g, a TraitElement
 * is deleted, we don't have to update the 'None' TraitElement.
 */
export const traitElementRouter = createRouter()
  /**
   * Delete TraitElement from their associated LayerElement.
   * This function is dynamic in that it allows a non-sorted list of TraitElements with different associated LayerElements.
   *
   */
  .mutation('delete', {
    input: z.object({
      traitElements: TraitElementDeleteInput,
    }),
    async resolve({ ctx, input }) {
      const { traitElements } = input

      /* Delete many TraitElement from Cloudinary */
      const response: Result<DeleteTraitElementResponse[]> = await deleteImageFilesFromCloudinary(
        traitElements.map((x) => ({ r: x.repositoryId, l: x.layerElementId, t: x.id }))
      )

      if (response.failed) {
        throw new trpc.TRPCError({
          code: `INTERNAL_SERVER_ERROR`,
          message: response.error,
        })
      }

      /* Delete many TraitElement from Db  */
      return await ctx.prisma.traitElement.deleteMany({
        where: {
          id: {
            in: traitElements.map((x) => x.id),
          },
        },
      })
    },
  })
  /**
   * Creates a TraitElement with their associated LayerElement.
   * This function is dynamic in that it allows a non-sorted list of TraitElements with different associated LayerElements.
   */
  .mutation('create', {
    input: z.object({
      traitElements: TraitElementCreateInput.min(1),
    }),
    async resolve({ ctx, input }) {
      const { traitElements } = input

      /* Create many traits based on their layerElementId & name */
      await ctx.prisma.traitElement.createMany({
        data: traitElements.map(({ name, layerElementId }) => ({
          layerElementId,
          name,
          weight: 0, // weight set to 0 to not fuck up existing collections
        })),
      })

      /* Return all the new TraitElement grouped by LayerElement */
      return await getLayerElementsWithTraitElements({
        layerElementIds: Object.keys(groupBy(traitElements, (x) => x.layerElementId)),
        prisma: ctx.prisma,
      })
    },
  })
  /**
   * Renames a TraitElement with their associated LayerElement.
   * This function is dynamic in that it allows a non-sorted list of TraitElements with different associated LayerElements.
   */
  .mutation('update.name', {
    input: z.object({
      traitElements: TraitElementUpdateNameInput.min(1),
    }),
    async resolve({ ctx, input }) {
      const { traitElements } = input

      /** Run sequential operations; as they don't depend on each other. */
      /** Source: https://www.prisma.io/docs/concepts/components/prisma-client/transactions#sequential-prisma-client-operations */
      await ctx.prisma.$transaction(
        traitElements.map(({ traitElementId: id, name }) =>
          ctx.prisma.traitElement.update({
            where: { id },
            data: { name },
          })
        ),
        { isolationLevel: Prisma.TransactionIsolationLevel.ReadUncommitted }
      )
    },
  })
  /**
   * Updates weight of TraitElements with their associated LayerElement.
   */
  .mutation('update.weight', {
    input: z.object({
      traitElements: TraitElementUpdateWeightInput.min(1),
    }),
    async resolve({ ctx, input }) {
      const { traitElements } = input

      /** Run sequential operations; as they don't depend on each other. */
      /** Source: https://www.prisma.io/docs/concepts/components/prisma-client/transactions#sequential-prisma-client-operations */
      await ctx.prisma.$transaction(
        traitElements.map(({ traitElementId: id, weight }) =>
          ctx.prisma.traitElement.update({
            where: { id },
            data: { weight },
          })
        ),
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
      )
    },
  })
