import { getMaxAllocationPerAddress } from 'src/server/common/ethers-get-contract-max-allocation-per-address'
import { getMintPrice } from 'src/server/common/ethers-get-contract-mint-price'
import { getContractOwner } from 'src/server/common/ethers-get-contract-owner'
import { getTotalSupply } from 'src/server/common/ethers-get-contract-total-supply'
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

    return {
      deployment,
      contract: {
        projectOwner: (await getContractOwner(address)).getValue(),
        ethPrice: (await getMintPrice(address)).getValue(),
        maxAllocationPerAddress: (await getMaxAllocationPerAddress(address)).getValue(),
        totalSupply: (await getTotalSupply(address)).getValue(),
        presaleStartTime: new Date(-10),
        publicStartTime: new Date(-8),
      },
    }
  }),
})
