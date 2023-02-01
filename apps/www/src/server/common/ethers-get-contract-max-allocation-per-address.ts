import { Result } from '@server/utils/response-result'
import { getElevateContract } from '@utils/ethers'
import type { BigNumber } from 'ethers'

export const getMaxMintPerAddress = async (address: string, chainId: number): Promise<Result<BigNumber>> => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await getElevateContract({ address, chainId }).maxMintPerAddress()
      if (response) {
        return resolve(Result.ok(response))
      }
      return reject(Result.fail("Couldn't get max allocation per address"))
    } catch (err) {
      if (err instanceof Error) {
        return reject(Result.fail("Couldn't get max allocation per address" + err.message))
      }
    }
  })
}
