import { getCollectionSize } from 'src/server/common/ethers-get-contract-collection-size'
import { getMaxAllocationPerAddress } from 'src/server/common/ethers-get-contract-max-allocation-per-address'
import { getMintPrice } from 'src/server/common/ethers-get-contract-mint-price'
import { getContractOwner } from 'src/server/common/ethers-get-contract-owner'
import { getPresaleTime } from 'src/server/common/ethers-get-contract-presale-time'
import { getPublicTime } from 'src/server/common/ethers-get-contract-public-time'
import { getTotalSupply } from 'src/server/common/ethers-get-contract-total-supply'
import { z } from 'zod'
import { publicProcedure, router } from '../trpc'

/**
 * Repository Router
 * Any Repository functionality should implemented here.
 *
 * @todo protect this router by checking if the user is the owner of the repository
 */
export const contractDeploymentRouter = router({
  findByAddress: publicProcedure.input(z.object({ address: z.string() })).query(async ({ ctx, input }) => {
    const { address } = input
    const deployment = await ctx.prisma.repositoryContractDeployment.findFirst({
      where: { address },
      include: { repository: { include: { organisation: true } }, repositoryDeployment: true },
    })
    const { chainId } = deployment
    const contract = {
      projectOwner: (await getContractOwner(address, chainId)).getValue(),
      mintPrice: (await getMintPrice(address, chainId)).getValue(),
      maxAllocationPerAddress: (await getMaxAllocationPerAddress(address, chainId)).getValue(),
      totalSupply: (await getTotalSupply(address, chainId)).getValue(),
      collectionSize: (await getCollectionSize(address, chainId)).getValue(),
      presaleTime: (await getPresaleTime(address, chainId)).getValue(),
      publicTime: (await getPublicTime(address, chainId)).getValue(),
    }
    return { deployment, contract }
  }),
})
