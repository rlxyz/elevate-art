import create from 'zustand'

export const useContractCreationStore = create<{
  currentSegment: number
  setCurrentSegment: (segment: number) => void
  contractName: string
  setContractName: (name: string) => void
  contractSymbol: string
  setContractSymbol: (symbol: string) => void
  mintType: 'on-chain' | 'off-chain'
  setMintType: (mintType: 'on-chain' | 'off-chain') => void
  blockchain: 'goerli' | 'mainnet'
  setBlockchain: (blockchain: 'goerli' | 'mainnet') => void
  collectionSize: number
  setCollectionSize: (size: number) => void
  pricePerToken: number
  setPricePerToken: (price: number) => void
  artCollection: 'main' | 'development'
  setArtCollection: (artCollection: 'main' | 'development') => void
}>((set) => ({
  currentSegment: 0,
  setCurrentSegment: (segment: number) => set({ currentSegment: segment }),
  contractName: 'Bored Ape Yacht Club',
  setContractName: (name: string) => set({ contractName: name }),
  contractSymbol: 'BAYC',
  setContractSymbol: (symbol: string) => set({ contractSymbol: symbol }),
  mintType: 'off-chain',
  setMintType: (mintType: 'on-chain' | 'off-chain') => set({ mintType: mintType }),
  blockchain: 'goerli',
  setBlockchain: (blockchain: 'goerli' | 'mainnet') => set({ blockchain: blockchain }),
  collectionSize: 0,
  setCollectionSize: (size: number) => set({ collectionSize: size }),
  pricePerToken: 0,
  setPricePerToken: (price: number) => set({ pricePerToken: price }),
  artCollection: 'main',
  setArtCollection: (artCollection: 'main' | 'development') => set({ artCollection: artCollection }),
}))
