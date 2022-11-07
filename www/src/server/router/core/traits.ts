import { getLayerElementsWithTraitElements } from '@server/scripts/get-layer-with-traits'
import { groupBy } from '@utils/object-utils'
import { env } from 'src/env/server.mjs'
import { z } from 'zod'
import { createRouter } from '../context'

const TraitElementDeleteInput = z.array(z.object({ id: z.string(), layerElementId: z.string(), repositoryId: z.string() }))
const TraitElementCreateInput = z.array(z.object({ name: z.string(), layerElementId: z.string(), repositoryId: z.string() }))
const TraitElementRenameInput = z.array(z.object({ name: z.string(), traitElementId: z.string(), repositoryId: z.string() }))

/**
 * TraitElement Router
 * Any TraitElement functionality should implemented here.
 */
export const traitElementRouter = createRouter()
  /**
   * Delete TraitElement from their associated LayerElement.
   * This function is dynamic in that it allows a non-sorted list of TraitElements with different associated LayerElements.
   */
  .mutation('delete', {
    input: z.object({
      traitElements: TraitElementDeleteInput,
    }),
    async resolve({ ctx, input }) {
      const { traitElements } = input

      /* Delete many TraitElement from Db  */
      await ctx.prisma.traitElement.deleteMany({
        where: {
          id: {
            in: traitElements.map((x) => x.id),
          },
        },
      })

      /* Delete many TraitElement from Cloudinary */
      /* This fetch sends request to Qstash to run delete jobs with retries if failed */
      await Promise.all(
        traitElements.map(async ({ repositoryId: r, layerElementId: l, id: t }) => {
          const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/image/${r}/${l}/${t}/delete`)
          if (response.status === 200) {
            // @todo log
            console.log(`delete ${r}/${l}/${t}`)
          } else {
            // @todo qstash
            console.log(`failed ${r}/${l}/${t}`)
          }
        })
      )
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
  .mutation('rename', {
    input: z.object({
      traitElements: TraitElementRenameInput.min(1),
    }),
    async resolve({ ctx, input }) {
      const { traitElements } = input

      /* Update many traits based on their traitElementId & name */
      await ctx.prisma.$transaction(async (tx) => {
        await Promise.all(
          traitElements.map(async ({ traitElementId: id, name }) => {
            await tx.traitElement.update({
              where: { id },
              data: { name },
            })
          })
        )
      })
    },
  })
