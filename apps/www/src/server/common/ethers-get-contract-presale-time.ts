import { Result } from '@server/utils/response-result'
import { getElevateContract } from '@utils/ethers'

export const getPresaleTime = async (address: string, chainId: number): Promise<Result<Date>> => {
  return new Promise(async (resolve, reject) => {
    getElevateContract({ address, chainId })
      .presaleTime()
      .then((data) => {
        return resolve(Result.ok(new Date(Number(data.toString()) * 1000)))
      })
      .catch((err) => {
        console.error(err)
        return reject(Result.ok(new Date(-1))) // @todo fix
      })
  })
}
