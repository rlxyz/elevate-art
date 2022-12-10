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
}>((set) => ({
  currentSegment: 0,
  setCurrentSegment: (segment: number) => set({ currentSegment: segment }),
  contractName: 'test',
  setContractName: (name: string) => set({ contractName: name }),
  contractSymbol: 'test',
  setContractSymbol: (symbol: string) => set({ contractSymbol: symbol }),
  mintType: 'off-chain',
  setMintType: (mintType: 'on-chain' | 'off-chain') => set({ mintType: mintType }),
  blockchain: 'goerli',
  setBlockchain: (blockchain: 'goerli' | 'mainnet') => set({ blockchain: blockchain }),
}))
