import { AssetDeploymentType } from '@prisma/client'
import { Result } from '@server/utils/response-result'
import { getElevateContract } from '@utils/ethers'

export const getTokenHash = async (address: string, chainId: number, tokenId: number): Promise<Result<string>> => {
  return new Promise(async (resolve, reject) => {
    getElevateContract({ address, chainId, type: AssetDeploymentType.GENERATIVE })
      .getTokenHash(tokenId)
      .then((data) => {
        return resolve(Result.ok(data))
      })
      .catch((err) => {
        console.error(err)
        return reject(Result.ok(''))
      })
  })
}
