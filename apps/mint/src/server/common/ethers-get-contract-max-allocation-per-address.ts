import { BigNumber } from 'ethers'
import { getContract } from 'src/shared/ethers'
import { Result } from '../utils/response-result'

export const getMaxAllocationPerAddress = async (address: string, chainId: number): Promise<Result<BigNumber>> => {
  return new Promise(async (resolve, reject) => {
    getContract({ address, chainId })
      .maxPublicBatchPerAddress()
      .then((data) => {
        return resolve(Result.ok(data))
      })
      .catch((err) => {
        return reject(Result.ok(BigNumber.from(0)))
      })
  })
}
