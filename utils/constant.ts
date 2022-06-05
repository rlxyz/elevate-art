export const NAMINGS = {
  title: 'REFLECTION by Dream Lab',
  description: ``,
  author: {
    dreamlabs: {
      name: 'Dream Lab',
      description: '',
    },
    rhapsody: {
      name: 'RLXYZ',
    },
  },
  keywords: 'nft, crypto, cryptoart, genart, photography, digital collectibles',
}

export const COLLECTION_DISTRIBUTION = {
  maxPublicBatchPerAddress: 2,
  totalSupply: 1111,
  oneMintPrice: 0.333,
  twoMintPrice: 0.666,
  gasLimit: 200000,
}

export const BREAKPOINTS = { mobile: 0, tablet: 768, desktop: 1280 }

export const QUERY_KEYS = {
  fetchCurrentBlockData: 'fetchCurrentBlockData',
}

export const NO_REFETCH_QUERY_OPTIONS = Object.freeze({
  refetchInterval: false,
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
})

export const ALLOWED_NETWORK = process.env.NEXT_PUBLIC_ALLOWED_NETWORK
  ? process.env.NEXT_PUBLIC_ALLOWED_NETWORK.split(',')
  : []

export const SUPPORTED_NETWORKS = [1, 4]

export const NETWORK_NAME = {
  1: 'Mainnet',
  4: 'Rinkeby',
}
