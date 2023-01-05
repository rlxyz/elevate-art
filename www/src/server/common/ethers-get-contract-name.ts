import { Result } from '@server/utils/response-result'
import { getElevateContract } from '@utils/ethers'

export const getContractName = async (address: string, chainId: number): Promise<Result<string>> => {
  return new Promise(async (resolve, reject) => {
    getElevateContract({ address, chainId })
      .name()
      .then((data) => {
        return resolve(Result.ok(data))
      })
      .catch((err) => {
        return reject(Result.ok(''))
      })
  })
}
