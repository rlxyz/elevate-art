import { ethers } from 'ethers'
import { clientEnv } from 'src/env/schema.mjs'

export const provider = new ethers.providers.InfuraProvider('mainnet', clientEnv.NEXT_PUBLIC_INFURA_ID)

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
