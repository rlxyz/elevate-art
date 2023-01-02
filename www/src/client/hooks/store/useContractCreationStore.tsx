import type { MotionValue } from 'framer-motion'
import create from 'zustand'
import createContext from 'zustand/context'
import { persist } from 'zustand/middleware'

interface ContractCreationStoreInterface {
  motionValues: {
    x: (MotionValue<number> | null)[]
    opacity: (MotionValue<number> | null)[]
  }
  currentSegment: number
  contractName: string
  contractSymbol: string
  mintType: 'on-chain' | 'off-chain'
  blockchain: 'goerli' | 'mainnet'
  collectionSize: number
  pricePerToken: number
  artCollection: 'main' | 'development'
  presale: boolean
  presaleSupply: number
  presalePrice: number
  presaleMaxMintAmount: number
  presaleMaxTransactionAmount: number
  publicSale: boolean
  publicSalePrice: number
  publicSaleMaxMintAmount: number
  publicSaleMaxTransactionAmount: number
}

interface ContractStoreFunctionInterface {
  setMotionValue: (index: number, value: MotionValue<number>, type: 'x' | 'opacity') => void
  setPresale: (presale: boolean) => void
  setPresaleSupply: (supply: number) => void
  setPresalePrice: (price: number) => void
  setPresaleMaxMintAmount: (amount: number) => void
  setPresaleMaxTransactionAmount: (amount: number) => void
  setPublicSale: (publicSale: boolean) => void
  setPublicSalePrice: (price: number) => void
  setPublicSaleMaxMintAmount: (amount: number) => void
  setPublicSaleMaxTransactionAmount: (amount: number) => void
  setCurrentSegment: (segment: number) => void
  setContractName: (name: string) => void
  setContractSymbol: (symbol: string) => void
  setMintType: (mintType: 'on-chain' | 'off-chain') => void
  setBlockchain: (blockchain: 'goerli' | 'mainnet') => void
  setCollectionSize: (size: number) => void
  setPricePerToken: (price: number) => void
  setArtCollection: (artCollection: 'main' | 'development') => void
}

interface ContractStoreInterface extends ContractStoreFunctionInterface, ContractCreationStoreInterface {}

const initialState: ContractCreationStoreInterface = {
  currentSegment: 0,
  contractName: 'Bored Ape Yacht Club',
  contractSymbol: 'BAYC',
  mintType: 'off-chain',
  blockchain: 'goerli',
  collectionSize: 10000,
  pricePerToken: 0.05,
  artCollection: 'main',
  presale: false,
  presaleSupply: 1000,
  presalePrice: 0.05,
  presaleMaxMintAmount: 1,
  presaleMaxTransactionAmount: 1,
  publicSale: false,
  publicSalePrice: 0.05,
  publicSaleMaxMintAmount: 1,
  publicSaleMaxTransactionAmount: 1,
  motionValues: {
    x: [null, null, null],
    opacity: [null, null, null],
  },
}

export const createContractCreationStore = create<ContractStoreInterface>()(
  persist(
    (set) => ({
      ...initialState,
      setMotionValue: (index: number, value: MotionValue, type: 'x' | 'opacity') => {
        set((state) => {
          const motionValues = state.motionValues
          if (motionValues[type][index] !== null) {
            motionValues[type][index] = value
            return { motionValues: motionValues }
          }
          return { motionValues: motionValues }
        })
      },
      setPresale: (presale: boolean) => set({ presale: presale }),
      setPresaleSupply: (supply: number) => set({ presaleSupply: supply }),
      setPresalePrice: (price: number) => set({ presalePrice: price }),
      setPresaleMaxMintAmount: (amount: number) => set({ presaleMaxMintAmount: amount }),
      setPresaleMaxTransactionAmount: (amount: number) => set({ presaleMaxTransactionAmount: amount }),
      setPublicSale: (publicSale: boolean) => set({ publicSale: publicSale }),
      setPublicSalePrice: (price: number) => set({ publicSalePrice: price }),
      setPublicSaleMaxMintAmount: (amount: number) => set({ publicSaleMaxMintAmount: amount }),
      setPublicSaleMaxTransactionAmount: (amount: number) => set({ publicSaleMaxTransactionAmount: amount }),
      setCurrentSegment: (segment: number) => set({ currentSegment: segment }),
      setContractName: (name: string) => set({ contractName: name }),
      setContractSymbol: (symbol: string) => set({ contractSymbol: symbol }),
      setMintType: (mintType: 'on-chain' | 'off-chain') => set({ mintType: mintType }),
      setBlockchain: (blockchain: 'goerli' | 'mainnet') => set({ blockchain: blockchain }),
      setCollectionSize: (size: number) => set({ collectionSize: size }),
      setPricePerToken: (price: number) => set({ pricePerToken: price }),
      setArtCollection: (artCollection: 'main' | 'development') => set({ artCollection: artCollection }),
    }),
    { name: 'contractCreationStore', getStorage: () => sessionStorage }
  )
)

export const ContractContext = createContext<typeof createContractCreationStore>()
const useContractCreationStore = ContractContext.useStore

export default useContractCreationStore
