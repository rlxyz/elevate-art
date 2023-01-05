import type { ContractInformationData, SaleConfig } from '@utils/contracts/ContractData'
import { BigNumber } from 'ethers'
import type { MotionValue } from 'framer-motion'
import create from 'zustand'
import createContext from 'zustand/context'
import { persist } from 'zustand/middleware'
import type { ContractCreationType } from './ContractCreationForm'

interface ContractCreationStoreInterface {
  motionValues: {
    x: (MotionValue<number> | null)[]
    opacity: (MotionValue<number> | null)[]
  }
  currentSegment: ContractCreationType
  contractInformationData: ContractInformationData
  saleConfig: SaleConfig[]
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
  setContractInformationData: (data: ContractInformationData) => void
  setSaleConfig: (data: SaleConfig[]) => void
  setPresale: (presale: boolean) => void
  setPresaleSupply: (supply: number) => void
  setPresalePrice: (price: number) => void
  setPresaleMaxMintAmount: (amount: number) => void
  setPresaleMaxTransactionAmount: (amount: number) => void
  setPublicSale: (publicSale: boolean) => void
  setPublicSalePrice: (price: number) => void
  setPublicSaleMaxMintAmount: (amount: number) => void
  setPublicSaleMaxTransactionAmount: (amount: number) => void
  setCurrentSegment: (segment: ContractCreationType) => void
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
  currentSegment: 'contract-detail',
  contractInformationData: {
    name: '',
    symbol: '',
    owner: '0x' as `0x${string}`,
    mintType: 'off-chain',
    chainId: 5,
    totalSupply: BigNumber.from(0),
    collectionSize: BigNumber.from(0),
  },
  saleConfig: [],
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
          motionValues[type][index] = value
          return { motionValues: motionValues }
        })
      },
      setSaleConfig: (data: SaleConfig[]) => set({ saleConfig: data }),
      setContractInformationData: (data: ContractInformationData) => set({ contractInformationData: data }),
      setPresale: (presale: boolean) => set({ presale: presale }),
      setPresaleSupply: (supply: number) => set({ presaleSupply: supply }),
      setPresalePrice: (price: number) => set({ presalePrice: price }),
      setPresaleMaxMintAmount: (amount: number) => set({ presaleMaxMintAmount: amount }),
      setPresaleMaxTransactionAmount: (amount: number) => set({ presaleMaxTransactionAmount: amount }),
      setPublicSale: (publicSale: boolean) => set({ publicSale: publicSale }),
      setPublicSalePrice: (price: number) => set({ publicSalePrice: price }),
      setPublicSaleMaxMintAmount: (amount: number) => set({ publicSaleMaxMintAmount: amount }),
      setPublicSaleMaxTransactionAmount: (amount: number) => set({ publicSaleMaxTransactionAmount: amount }),
      setCurrentSegment: (segment: ContractCreationType) => set({ currentSegment: segment }),
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
