import { formatUnits } from 'ethers/lib/utils.js'
import { getElevateContract } from 'src/shared/ethers'
import { Result } from '../utils/response-result'

export const getPublicTime = async (address: string, chainId: number): Promise<Result<Date>> => {
  return new Promise(async (resolve, reject) => {
    getElevateContract({ address, chainId })
      .publicTime()
      .then((data) => {
        return resolve(Result.ok(new Date(Number(formatUnits(data, 0)) * 1000)))
      })
      .catch((err) => {
        console.error(err)
        return reject(Result.ok(new Date(-1))) // @todo fix
      })
  })
}
