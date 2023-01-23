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
  findWhitelistByAddressAndType: publicProcedure
    .input(z.object({ address: z.string(), type: z.nativeEnum(WhitelistType) }))
    .query(async ({ ctx, input }) => {
      const { address, type } = input

      /**
       * Look for the deployment
       */
      const whitelists = await ctx.prisma.whitelist.findMany({
        where: { type, contractDeployment: { address } },
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
        type: z.nativeEnum(WhitelistType),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { contractDeploymentId, whitelist, type } = input

      const BATCH_CHUNK_SIZE = 1000
      for (const chunk of Array.from({ length: Math.ceil(whitelist.length / BATCH_CHUNK_SIZE) }, (_, index) =>
        whitelist.slice(index * BATCH_CHUNK_SIZE, (index + 1) * BATCH_CHUNK_SIZE)
      )) {
        await ctx.prisma.whitelist.createMany({
          data: chunk.map(({ address, mint }) => ({
            address: getAddress(address),
            mint,
            contractDeploymentId,
            type: type as WhitelistType,
          })),
          skipDuplicates: true,
        })
      }

      return await ctx.prisma.whitelist.findMany({
        where: { contractDeploymentId, type: type as WhitelistType },
      })
    }),
  findAllowlistByDeploymentName: publicProcedure
    .input(
      z.object({
        name: z.string(),
        repositoryId: z.string(),
        type: z.nativeEnum(WhitelistType),
      })
    )
    .query(async ({ ctx, input }) => {
      const { name, repositoryId, type } = input

      /**
       * Look for the deployment
       */
      const whitelists = await ctx.prisma.whitelist.findMany({
        where: {
          type: type as WhitelistType,
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
