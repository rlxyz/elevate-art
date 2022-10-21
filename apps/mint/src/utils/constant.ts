import { env } from 'src/env/client.mjs'
import ContractAbi from '../utils/contracts/Rhapsody.json'

export const COLLECTION_DISTRIBUTION = {
  maxPublicBatchPerAddress: 2,
  totalSupply: 1111,
  oneMintPrice: 0.333,
  twoMintPrice: 0.666,
  gasLimit: 200000,
}

export const SUPPORTED_NETWORKS = [1, 4]

export const NETWORK_NAME = {
  1: 'Mainnet',
  5: 'Goerli',
}

export const RhapsodyContractConfig = {
  addressOrName: env.NEXT_PUBLIC_CONTRACT_ADDRESS,
  contractInterface: ContractAbi,
}
