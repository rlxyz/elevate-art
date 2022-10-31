import { deleteImageFromCloudinary } from '@server/common/cld-delete-image'
import { z } from 'zod'
import { createRouter } from '../context'

/**
 * TraitElement Router
 * Any TraitElement functionality from the application should be done here.
 */
export const traitElementRouter = createRouter()
  .mutation('delete', {
    input: z.object({
      traitElements: z.array(z.object({ id: z.string(), layerElementId: z.string(), repositoryId: z.string() })),
    }),
    async resolve({ ctx, input }) {
      const { traitElements } = input

      /* Delete many TraitElement from Db */
      await ctx.prisma.traitElement.deleteMany({
        where: {
          id: {
            in: traitElements.map((x) => x.id),
          },
        },
      })

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
