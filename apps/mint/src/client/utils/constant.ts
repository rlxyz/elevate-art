import { config } from 'src/client/utils/config'

import ContractAbi from '../../../contracts/Rhapsody.json'

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
  4: 'Rinkeby',
}

export const RhapsodyContractConfig = {
  addressOrName: config.contractAddress,
  contractInterface: ContractAbi,
}
