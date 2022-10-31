import { deleteImageFromCloudinary } from '@server/common/cld-delete-image'
import { z } from 'zod'
import { groupBy, sumBy } from '../../../utils/object-utils'
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
   */
  .mutation('delete', {
    input: z.object({
      traitElements: z.array(z.object({ id: z.string(), layerElementId: z.string(), repositoryId: z.string() })).min(1),
    }),
    async resolve({ ctx, input }) {
      const { traitElements } = input

      /* Iterate each unique LayerElement & delete many TraitElements  */
      await Promise.all(
        Object.entries(groupBy(traitElements, (x) => x.layerElementId)).map(
          async ([layerElementId, traitElementsToBeDeleted]) => {
            /* Run Atomic Transaction */
            await ctx.prisma.$transaction(async (tx) => {
              /* Initialize */
              const ids = traitElementsToBeDeleted.map((x) => x.id)

              /* Sum the weights being deleted */
              const removed = sumBy(await tx.traitElement.findMany({ where: { id: { in: ids } } }), (x) => x.weight)

              /* Delete the traits */
              const { count } = await tx.traitElement.deleteMany({
                where: {
                  id: {
                    in: ids,
                  },
                },
              })

              /* Scale the leftover traits  */
              const toUpdate = await tx.traitElement.findMany({ where: { layerElementId } })
              const leftover = sumBy(toUpdate, (x) => x.weight)
              await tx.traitElement.updateMany({
                where: { id: { in: ids } },
                data: toUpdate.map(({ id, weight }) => ({
                  weight: (weight * removed) / leftover,
                })),
              })
            })
          }
        )
      )

      /* Delete many TraitElement from Cloudinary */
      /* @todo qstash delete traits from cloudinary to ensure it happens */
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
