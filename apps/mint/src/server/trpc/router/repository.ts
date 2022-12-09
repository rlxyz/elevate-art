import { z } from 'zod'
import { protectedProcedure, router } from '../trpc'

/**
 * Repository Router
 * Any Repository functionality should implemented here.
 *
 * @todo protect this router by checking if the user is the owner of the repository
 */
export const repositoryRouter = router({
  findContractDeploymentByName: protectedProcedure
    .input(
      z.object({
        repositoryName: z.string(),
        organisationName: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.repositoryContractDeployment.findFirst({
        where: {
          repository: {
            name: input.repositoryName,
            organisation: {
              name: input.organisationName,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      })
    }),
})
