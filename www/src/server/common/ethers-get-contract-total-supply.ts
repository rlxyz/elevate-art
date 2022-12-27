import { Result } from '@server/utils/response-result'
import { getElevateContract } from '@utils/ethers'
import { BigNumber } from 'ethers'

export const getTotalSupply = async (address: string, chainId: number): Promise<Result<BigNumber>> => {
  return new Promise(async (resolve, reject) => {
    getElevateContract({ address, chainId })
      .totalSupply()
      .then((data) => {
        return resolve(Result.ok(data))
      })
      .catch((err) => {
        console.error(err)
        return reject(Result.ok(BigNumber.from(0)))
      })
  })
}
