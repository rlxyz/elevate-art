import { ethers } from 'ethers'
import { isAddress } from 'ethers/lib/utils'

import { config } from './config'

const provider = new ethers.providers.JsonRpcProvider(config.ethRpcUrl)

const developmentEnvironmentEnsMapping = {
  'jeevanpillay.eth': '0xb21B6a39ae2f164357f8e616E30521baECfd7f87',
  'sekured.eth': '0xF9b421ce4DdE27aC57Bb94EF562566956DC1c97E',
}

export const getEthereumAddress = async (name: string): Promise<string> => {
  if (isAddress(name)) {
    return name
  }

  if (process.env.NEXT_PUBLIC_NODE_ENV === 'development') {
    return developmentEnvironmentEnsMapping[name]
  }

  return await provider.resolveName(name)
}
