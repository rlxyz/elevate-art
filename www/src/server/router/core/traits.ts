import { deleteImageFromCloudinary } from '@server/common/cld-delete-image'
import { z } from 'zod'
import { groupBy } from '../../../utils/object-utils'
import { createRouter } from '../context'

/**
 * TraitElement Router
 * Any TraitElement functionality from the application should be done here.
 */
export const traitElementRouter = createRouter()
  /**
   * Delete TraitElement from their associated LayerElement.
   * This function is dynamic in that it allows a non-sorted list of TraitElements with different associated LayerElements.
   * Correctness: The invariant (weight) will always be equal to each other due to scale up that occurs.
   *
   * @todo log the delete that occurs
   * @todo qstash delete traits from cloudinary to ensure it happens
   */
  .mutation('delete', {
    input: z.object({
      traitElements: z.array(z.object({ id: z.string(), layerElementId: z.string(), repositoryId: z.string() })).min(1),
    }),
    async resolve({ ctx, input }) {
      const { traitElements } = input

      /* Iterate each unique LayerElement & delete many TraitElements  */
      await Promise.all(
        Object.entries(groupBy(traitElements, (x) => x.layerElementId)).map(async ([_, traitElementsToBeDeleted]) => {
          /* Run Atomic Transaction */
          await ctx.prisma.$transaction(async (tx) => {
            /* Initialize */
            const ids = traitElementsToBeDeleted.map((x) => x.id)

            /* Delete the traits */
            await tx.traitElement.deleteMany({
              where: {
                id: {
                  in: ids,
                },
              },
            })
          })
        })
      )

      /* Delete many TraitElement from Cloudinary */
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
  .mutation('create', {
    input: z.object({
      traitElements: z.array(z.object({ name: z.string(), layerElementId: z.string(), repositoryId: z.string() })),
    }),
    async resolve({ ctx, input }) {
      const { traitElements } = input

      /* Create many traits based on their layerElementId & name */
      await ctx.prisma.traitElement.createMany({
        data: traitElements.map(({ name, layerElementId }) => ({
          layerElementId,
          name,
        })),
      })
    },
  })
