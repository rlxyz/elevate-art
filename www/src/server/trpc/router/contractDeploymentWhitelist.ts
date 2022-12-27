import { WhitelistType } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { publicProcedure, router } from '../trpc'

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
})
