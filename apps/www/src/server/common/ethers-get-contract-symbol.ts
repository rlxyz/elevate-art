import { Result } from '@server/utils/response-result'
import { getElevateContract } from '@utils/ethers'

export const getContractSymbol = async (address: string, chainId: number): Promise<Result<string>> => {
  return new Promise(async (resolve, reject) => {
    getElevateContract({ address, chainId })
      .symbol()
      .then((data) => {
        return resolve(Result.ok(data))
      })
      .catch((err) => {
        console.error(err)
        return reject(Result.ok(''))
      })
  })
}
