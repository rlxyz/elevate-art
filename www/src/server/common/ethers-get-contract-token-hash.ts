import { AssetDeploymentType } from '@prisma/client'
import { Result } from '@server/utils/response-result'
import { getElevateContract } from '@utils/ethers'

export const getTokenHash = async (address: string, chainId: number, tokenId: number): Promise<Result<string>> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await getElevateContract({ address, chainId, type: AssetDeploymentType.GENERATIVE }).tokenHash(tokenId)
      if (response) {
        return resolve(Result.ok(response))
      }
    } catch (err) {
      return reject(Result.fail("Couldn't get token hash"))
    }
  })
}
