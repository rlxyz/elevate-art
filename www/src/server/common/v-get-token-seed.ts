import type { AssetDeployment, ContractDeployment } from '@prisma/client'
import { AssetDeploymentType } from '@prisma/client'
import { getTokenHash } from '@server/common/ethers-get-contract-token-hash'
import { Result } from '@server/utils/response-result'
import * as v from 'src/shared/compiler'

export const generateSeedBasedOnAssetDeploymentType = async (
  deployment: AssetDeployment,
  contractDeployment: ContractDeployment,
  tokenId: number
): Promise<Result<string>> => {
  if (deployment.type === AssetDeploymentType.GENERATIVE) {
    const { address, chainId } = contractDeployment
    getTokenHash(address, chainId, tokenId)
      .then((response) => {
        if (response.failed) {
          return Result.fail("Couldn't get token hash")
        }
        return Result.ok(response.getValue())
      })
      .catch((err) => {
        return Result.fail("Couldn't get token hash")
      })
  } else if (deployment.type === AssetDeploymentType.BASIC) {
    return Result.ok(v.seed(deployment.repositoryId, deployment.slug, deployment.generations, tokenId))
  }

  return Result.fail("Couldn't get token hash")
}
