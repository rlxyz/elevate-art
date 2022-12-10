import { BigNumber } from 'ethers'
import { getContract } from 'src/shared/ethers'
import { Result } from '../utils/response-result'

export const getContractOwner = async (address: string, chainId: number): Promise<Result<string>> => {
  return new Promise(async (resolve, reject) => {
    getContract({ address, chainId })
      .owner()
      .then((data) => {
        return resolve(Result.ok(data))
      })
      .catch((err) => {
        console.error(err)
        return reject(Result.ok(BigNumber.from(0)))
      })
  })
}
