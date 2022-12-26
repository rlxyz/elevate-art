import { AssetDeploymentType } from '@prisma/client'
import { getElevateContract } from '@server/utils/ethers'
import { Result } from '../utils/response-result'

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
