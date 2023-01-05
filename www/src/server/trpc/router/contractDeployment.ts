import { getClaimTime } from '@server/common/ethers-get-contract-claim-time'
import { getCollectionSize } from '@server/common/ethers-get-contract-collection-size'
import { getMaxAllocationPerAddress } from '@server/common/ethers-get-contract-max-allocation-per-address'
import { getMintPrice } from '@server/common/ethers-get-contract-mint-price'
import { getContractOwner } from '@server/common/ethers-get-contract-owner'
import { getPresaleTime } from '@server/common/ethers-get-contract-presale-time'
import { getPublicTime } from '@server/common/ethers-get-contract-public-time'
import { getTotalSupply } from '@server/common/ethers-get-contract-total-supply'
import { TRPCError } from '@trpc/server'
import type { ContractInformationData, PayoutData, RhapsodyContractData, SaleConfig } from '@utils/contracts/ContractData'
import { BigNumber } from 'ethers'
import { env } from 'src/env/server.mjs'
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

    /**
     * Look for the deployment
     */
    const deployment = await ctx.prisma.contractDeployment.findFirst({
      where: { address },
      include: { repository: { include: { organisation: true } }, assetDeployment: true },
    })

    /**
     * If deployment does not exists, return not found
     */
    if (!deployment) {
      // new trpc error
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Contract deployment with address ${address} not found`,
      })
    }

    /**
     * Find the contract-level data. This query should only be for contract-data that doesn't change often.
     */
    const { chainId } = deployment
    const contract = {
      owner: (await getContractOwner(address, chainId)).getValue(),
      totalSupply: (await getTotalSupply(address, chainId)).getValue(), // @todo remove this
      collectionSize: (await getCollectionSize(address, chainId)).getValue(),
      claimPeriod: {
        startTimestamp: (await getClaimTime(address, chainId)).getValue(),
        mintPrice: BigNumber.from(0),
        maxAllocationPerAddress: (await getMaxAllocationPerAddress(address, chainId)).getValue(),
      },
      presalePeriod: {
        startTimestamp: (await getPresaleTime(address, chainId)).getValue(),
        mintPrice: (await getMintPrice(address, chainId)).getValue(),
        maxAllocationPerAddress: (await getMaxAllocationPerAddress(address, chainId)).getValue(),
      },
      publicPeriod: {
        startTimestamp: (await getPublicTime(address, chainId)).getValue(),
        mintPrice: (await getMintPrice(address, chainId)).getValue(),
        maxAllocationPerAddress: (await getMaxAllocationPerAddress(address, chainId)).getValue(),
      },
    } as RhapsodyContractData

    /** Return */
    return { deployment, contract }
  }),
  findContractDataByAddress: publicProcedure.input(z.object({ address: z.string(), chainId: z.number() })).query(async ({ ctx, input }) => {
    console.log(`${env.NEXT_PUBLIC_API_URL}/blockchain/${input.chainId}/${input.address}`)
    const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/blockchain/${input.chainId}/${input.address}`)
    if (!response.ok) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Something went wrong while fetching contract information data for ${input.address}`,
      })
    }
    const contract = await response.json()
    console.log(contract)
    return contract as ContractInformationData
  }),
  findContractPayoutDataByAddress: publicProcedure
    .input(z.object({ address: z.string(), chainId: z.number() }))
    .query(async ({ ctx, input }) => {
      const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/blockchain/${input.chainId}/${input.address}/payout`)
      if (!response.ok) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Something went wrong while fetching contract payout data for ${input.address}`,
        })
      }
      const contract = await response.json()
      return contract as PayoutData
    }),
  findContractSaleConfigsByAddress: publicProcedure
    .input(z.object({ address: z.string(), chainId: z.number() }))
    .query(async ({ ctx, input }) => {
      const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/blockchain/${input.chainId}/${input.address}/sale-configs`)
      if (!response.ok) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Something went wrong while fetching contract sale config data for ${input.address}`,
        })
      }
      const contract = await response.json()
      return contract as SaleConfig[]
    }),
})
