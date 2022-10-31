import { env } from 'src/env/client.mjs'
import { z } from 'zod'
import { createRouter } from '../context'

/**
 * TraitElement Router
 * Any TraitElement functionality from the application should be done here.
 */
export const traitElementRouter = createRouter()
  /**
   * Delete TraitElement from their associated LayerElement.
   * This function is dynamic in that it allows a non-sorted list of TraitElements with different associated LayerElements.
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

      /* Delete many TraitElement from Db  */
      await ctx.prisma.traitElement.deleteMany({
        where: {
          id: {
            in: traitElements.map((x) => x.id),
          },
        },
      })

      /* Delete many TraitElement from Cloudinary */
      await Promise.all(
        traitElements.map(
          async ({ repositoryId: r, layerElementId: l, id: t }) =>
            await fetch(`${env.NEXT_PUBLIC_API_URL}/${r}/${l}/${t}/delete/queue`)
        )
      )
    },
  })
  /**
   * Creates a TraitElement with their associated LayerElement.
   * This function is dynamic in that it allows a non-sorted list of TraitElements with different associated LayerElements.
   *
   * @todo log the create that occurs
   */
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
