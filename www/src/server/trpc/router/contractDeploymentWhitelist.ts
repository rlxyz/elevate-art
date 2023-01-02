import { WhitelistType } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { protectedProcedure, publicProcedure, router } from '../trpc'
/**
 * Repository Router
 * Any Repository functionality should implemented here.
 *
 * @todo protect this router by checking if the user is the owner of the repository
 */
export const contractDeploymentWhitelistRouter = router({
  findAllowlistByAddress: publicProcedure.input(z.object({ address: z.string() })).query(async ({ ctx, input }) => {
    const { address } = input

    /**
     * Look for the deployment
     */
    const whitelists = await ctx.prisma.whitelist.findMany({
      where: { type: WhitelistType.ALLOWLIST, contractDeployment: { address } },
      select: { address: true, mint: true },
    })

    /**
     * If deployment does not exists, return not found
     */
    if (!whitelists) {
      // new trpc error
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Contract deployment with address ${address} not found`,
      })
    }

    /** Return */
    return { whitelists }
  }),
  findClaimByAddress: publicProcedure.input(z.object({ address: z.string() })).query(async ({ ctx, input }) => {
    const { address } = input

    /**
     * Look for the deployment
     */
    const whitelists = await ctx.prisma.whitelist.findMany({
      where: { type: WhitelistType.CLAIM, contractDeployment: { address } },
      select: { address: true, mint: true },
    })

    /**
     * If deployment does not exists, return not found
     */
    if (!whitelists) {
      // new trpc error
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Contract deployment with address ${address} not found`,
      })
    }

    /** Return */
    return { whitelists }
  }),
  create: protectedProcedure
    .input(
      z.object({
        contractDeploymentId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { contractDeploymentId } = input

      const BATCH_CHUNK_SIZE = 1000
      const ARRAY_SIZE = 100
      const array = Array.from(Array(ARRAY_SIZE).keys())

      for (const chunk of Array.from({ length: Math.ceil(array.length / BATCH_CHUNK_SIZE) }, (_, index) =>
        array.slice(index * BATCH_CHUNK_SIZE, (index + 1) * BATCH_CHUNK_SIZE)
      )) {
        await ctx.prisma.whitelist.createMany({
          data: chunk.map((x) => ({
            address: `0x-some-address-${(Math.random() + 1).toString(36).substring(6)}`,
            mint: 1,
            contractDeploymentId,
          })),
        })
      }

      return await ctx.prisma.whitelist.findMany({
        where: { contractDeploymentId },
      })
    }),
  findAllowlistByAssetDeploymentId: publicProcedure
    .input(
      z.object({
        name: z.string(),
        repositoryId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { name, repositoryId } = input

      /**
       * Look for the deployment
       */
      const whitelists = await ctx.prisma.whitelist.findMany({
        where: {
          type: WhitelistType.ALLOWLIST,
          contractDeployment: {
            assetDeployment: { name, repositoryId },
          },
        },
      })

      /**
       * If deployment does not exists, return not found
       */
      if (!whitelists) {
        // new trpc error
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Asset deployment with asset deployment name ${name} not found`,
        })
      }

      /** Return */
      return whitelists
    }),
})
