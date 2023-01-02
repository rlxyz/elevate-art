import { WhitelistType } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { getAddress } from 'ethers/lib/utils.js'
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
        whitelist: z.array(
          z.object({
            address: z.string(),
            mint: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { contractDeploymentId, whitelist } = input

      const BATCH_CHUNK_SIZE = 1000
      console.log('creating....')
      for (const chunk of Array.from({ length: Math.ceil(whitelist.length / BATCH_CHUNK_SIZE) }, (_, index) =>
        whitelist.slice(index * BATCH_CHUNK_SIZE, (index + 1) * BATCH_CHUNK_SIZE)
      )) {
        await ctx.prisma.whitelist.createMany({
          data: chunk.map(({ address, mint }) => ({
            address: getAddress(address),
            mint,
            contractDeploymentId,
          })),
          skipDuplicates: true,
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
