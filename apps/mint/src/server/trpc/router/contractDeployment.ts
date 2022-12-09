import { z } from 'zod'
import { protectedProcedure, router } from '../trpc'

/**
 * Repository Router
 * Any Repository functionality should implemented here.
 *
 * @todo protect this router by checking if the user is the owner of the repository
 */
export const contractDeploymentRouter = router({
  findByAddress: protectedProcedure.input(z.object({ address: z.string() })).query(async ({ ctx, input }) => {
    const { address } = input
    const deployment = await ctx.prisma.repositoryContractDeployment.findFirst({
      where: { address },
      include: { repository: { include: { organisation: true } }, repositoryDeployment: true },
    })
    return deployment
  }),
})
