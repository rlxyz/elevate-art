import type { AssetDeployment, ContractDeployment } from '@prisma/client'
import { AssetDeploymentType } from '@prisma/client'
import { Result } from '@server/utils/response-result'
import * as v from 'src/shared/compiler'
import { getTokenHash } from './ethers-get-contract-token-hash'

export const generateSeedBasedOnAssetDeploymentType = async (
  deployment: AssetDeployment,
  contractDeployment: ContractDeployment,
  tokenId: number
): Promise<Result<string>> => {
  try {
    if (deployment.type === AssetDeploymentType.GENERATIVE) {
      const { address, chainId } = contractDeployment
      const response = await getTokenHash(address, chainId, tokenId)
      if (response.failed) {
        return Result.fail(response.error || 'Failed to get token hash')
      }
      return Result.ok(response.getValue())
    } else if (deployment.type === AssetDeploymentType.BASIC) {
      return Result.ok(v.seed(deployment.repositoryId, deployment.slug, deployment.generations, tokenId))
    }
  } catch (err) {
    if (err instanceof Error) {
      return Result.fail(err.message)
    }
  }

  return Result.fail("Couldn't get token hash")
}
