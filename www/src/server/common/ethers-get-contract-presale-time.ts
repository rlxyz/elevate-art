import { Result } from '@server/utils/response-result'
import { getElevateContract } from '@utils/ethers'
import { formatUnits } from 'ethers/lib/utils.js'

export const getPresaleTime = async (address: string, chainId: number): Promise<Result<Date>> => {
  return new Promise(async (resolve, reject) => {
    getElevateContract({ address, chainId })
      .presaleTime()
      .then((data) => {
        return resolve(Result.ok(new Date(Number(formatUnits(data, 0)))))
      })
      .catch((err) => {
        console.error(err)
        return reject(Result.ok(new Date(-1))) // @todo fix
      })
  })
}
