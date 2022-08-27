import { ethers } from 'ethers'
import { isAddress } from 'ethers/lib/utils'

import { config } from './config'

const provider = new ethers.providers.JsonRpcProvider(config.ethRpcUrl)

export const getEthereumAddress = async (name: string): Promise<string> => {
  if (isAddress(name)) {
    return name
  }

  return (await provider.resolveName(name)) || ''
}
