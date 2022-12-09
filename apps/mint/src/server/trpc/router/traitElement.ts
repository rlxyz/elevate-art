import { Prisma } from '@prisma/client'
import { deleteImageFilesFromCloudinary, DeleteTraitElementResponse } from '@server/common/cld-delete-image'
import { updateManyByField } from '@server/utils/prisma-utils'
import { Result } from '@server/utils/response-result'
import { TRPCError } from '@trpc/server'
import Big from 'big.js'
import { sumByBig } from 'src/shared/object-utils'
import { z } from 'zod'
import { protectedProcedure, router } from '../trpc'

const TraitElementDeleteInput = z.array(z.object({ id: z.string(), layerElementId: z.string(), repositoryId: z.string() }))
const TraitElementCreateManyByLayerElementIdInput = z.object({
  layerElementId: z.string(),
  traitElements: z.array(z.object({ name: z.string() })),
})
const TraitElementUpdateNameInput = z.array(z.object({ name: z.string(), traitElementId: z.string(), repositoryId: z.string() }))
const TraitElementUpdateWeightInput = z.array(z.object({ weight: z.number(), traitElementId: z.string(), layerElementId: z.string() }))

/**
 * TraitElement Router
 * Any TraitElement functionality should implemented here.
 *
 * @note the "None" is not in the db. This allow us to dynamically update the current weight of the none trait by
 * summing up all TraitElements weights and subtracting it from 100. This is done at client-side. One of the advantages,
 * is that we don't have to update the 'None' TraitElement everytime another TraitElement is updated. For e.g, a TraitElement
 * is deleted, we don't have to update the 'None' TraitElement.
 */
export const traitElementRouter = router({
  delete: protectedProcedure
    .input(
      z.object({
        traitElements: TraitElementDeleteInput,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { traitElements } = input

      /* Delete many TraitElement from Cloudinary */
      const response: Result<DeleteTraitElementResponse[]> = await deleteImageFilesFromCloudinary(
        traitElements.map((x) => ({ r: x.repositoryId, l: x.layerElementId, t: x.id }))
      )

      if (response.failed) {
        throw new TRPCError({
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
    }),
  createManyByLayerElementId: protectedProcedure.input(TraitElementCreateManyByLayerElementIdInput).mutation(async ({ ctx, input }) => {
    const { layerElementId, traitElements } = input

    /* Create many traits based on their layerElementId & name */
    await ctx.prisma.traitElement.createMany({
      data: traitElements.map(({ name }) => ({
        layerElementId,
        name,
        weight: 0, // weight set to 0 to not fuck up existing collections
      })),
    })

    return await ctx.prisma.traitElement.findMany({
      where: { layerElementId: layerElementId },
      orderBy: [{ weight: 'desc' }, { name: 'asc' }],
      include: {
        rulesPrimary: { orderBy: [{ condition: 'asc' }, { primaryTraitElement: { name: 'asc' } }] },
        rulesSecondary: { orderBy: [{ condition: 'asc' }, { primaryTraitElement: { name: 'asc' } }] },
      },
    })
  }),
  updateName: protectedProcedure
    .input(
      z.object({
        traitElements: TraitElementUpdateNameInput,
      })
    )
    .mutation(async ({ ctx, input }) => {
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
    }),
  updateWeight: protectedProcedure
    .input(
      z.object({
        traitElements: TraitElementUpdateWeightInput,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { traitElements } = input

      /** @todo check this! */
      const sum = sumByBig(traitElements, (x) => Big(x.weight))
      if (sum.gt(Big(100))) {
        throw new TRPCError({
          code: `BAD_REQUEST`,
          message: `Sum of weights cannot be greater than 100`,
        })
      }

      /** Run sequential operations; as they don't depend on each other. */
      return await updateManyByField(ctx.prisma, 'TraitElement', 'weight', traitElements, (x) => [x.traitElementId, x.weight])
    }),
})
