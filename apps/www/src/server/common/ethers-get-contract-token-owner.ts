import { getElevateContract } from '@utils/ethers'
import { Result } from '../utils/response-result'

export const getContractTokenOwner = async (address: string, chainId: number, tokenId: number): Promise<Result<`0x${string}`>> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await getElevateContract({ address, chainId }).ownerOf(tokenId)
      if (response) {
        return resolve(Result.ok(response as `0x${string}`))
      }
      return reject(Result.fail)
    } catch (err) {
      if (err instanceof Error) {
        return reject(Result.fail("Couldn't get owner of" + err.message))
      }
    }
  })
}
