import { z } from 'zod'
import { protectedProcedure, router } from '../trpc'

/**
 * Collection Router
 * Any Collection functionality should implemented here.
 *
 * @todo protect this router by checking if the user is the owner of the repository
 */
export const whitelistRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        contractDeploymentId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { contractDeploymentId } = input

      return await ctx.prisma.whitelist.createMany({
        data: Array.from(Array(1000).keys()).map((x) => ({
          address: `0x-some-address-${x}`,
          mint: 1,
          contractDeploymentId,
        })),
      })
    }),
})
