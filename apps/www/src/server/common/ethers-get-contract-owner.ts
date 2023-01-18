import { Result } from '@server/utils/response-result'
import { getElevateContract } from '@utils/ethers'

export const getContractOwner = async (address: string, chainId: number): Promise<Result<`0x${string}`>> => {
  return new Promise(async (resolve, reject) => {
    getElevateContract({ address, chainId })
      .owner()
      .then((data) => {
        return resolve(Result.ok(data as `0x${string}`))
      })
      .catch((err) => {
        console.error(err)
        return reject(Result.ok('0x' as `0x${string}`))
      })
  })
}
