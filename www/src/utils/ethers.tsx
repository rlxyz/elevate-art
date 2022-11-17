import { ethers } from 'ethers'
import { env } from 'src/env/client.mjs'

export const provider = new ethers.providers.InfuraProvider('mainnet', env.NEXT_PUBLIC_INFURA_ID)

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
