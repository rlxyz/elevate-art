import { ethers } from 'ethers'
import { env } from 'src/env/client.mjs'

export const provider = new ethers.providers.AlchemyProvider('mainnet', env.NEXT_PUBLIC_ALCHEMY_ID)

export const getEnsName = async (address: string): Promise<string | null> =>
  new Promise((resolve) => {
    try {
      resolve(provider.lookupAddress(address))
    } catch (error) {
      resolve(null)
    }
  })

export const getAddressFromEns = async (ensName: string): Promise<string | null> =>
  new Promise((resolve) => {
    try {
      resolve(provider.resolveName(ensName))
    } catch (e) {
      resolve(null)
    }
  })

export const parseChainId = (chainId: number): string => {
  switch (chainId) {
    case 1:
      return 'mainnet'
    case 5:
      return 'goerli'
    default:
      return 'unknown'
  }
}
