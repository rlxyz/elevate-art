import { AssetDeploymentType } from '@prisma/client'
import type { ContractInformationData, SaleConfig } from '@utils/contracts/ContractData'
import { BigNumber } from 'ethers'
import type { MotionValue } from 'framer-motion'
import create from 'zustand'
import createContext from 'zustand/context'
import type { ContractCreationType } from '.'
import type { SaleConfigType } from './MintDetailsForm'
import { SaleConfigEnum } from './MintDetailsForm'

export type SaleConfigMap = Map<SaleConfigType, SaleConfig> //key: SaleConfigType, value: SaleConfig

interface ContractCreationStoreInterface {
  motionValues: {
    x: (MotionValue<number> | null)[]
    opacity: (MotionValue<number> | null)[]
  }
  currentSegment: ContractCreationType
  contractInformationData: ContractInformationData
  saleConfig: SaleConfigMap
  payoutData: {
    estimatedPayout: BigNumber
    paymentReceiver: `0x${string}`
  }
}

interface ContractStoreFunctionInterface {
  setMotionValue: (index: number, value: MotionValue<number>, type: 'x' | 'opacity') => void
  setContractInformationData: (data: ContractInformationData) => void
  setSaleConfig: (type: SaleConfigType, data: SaleConfig) => void
  setCurrentSegment: (segment: ContractCreationType) => void
}

interface ContractStoreInterface extends ContractStoreFunctionInterface, ContractCreationStoreInterface {}

const initialState: ContractCreationStoreInterface = {
  currentSegment: 'contract-detail',
  contractInformationData: {
    name: '',
    symbol: '',
    owner: '0x' as `0x${string}`,
    mintType: AssetDeploymentType.BASIC,
    chainId: 5,
    // totalSupply: BigNumber.from(0),
    collectionSize: BigNumber.from(0),
  },
  saleConfig: new Map<SaleConfigType, SaleConfig>([
    [
      SaleConfigEnum.enum.CLAIM,
      {
        startTimestamp: new Date(),
        mintPrice: BigNumber.from(0),
        maxAllocationPerAddress: BigNumber.from(0),
      },
    ],
    [
      SaleConfigEnum.enum.PRESALE,
      {
        startTimestamp: new Date(),
        mintPrice: BigNumber.from(0),
        maxAllocationPerAddress: BigNumber.from(0),
      },
    ],
    [
      SaleConfigEnum.enum.PUBLIC,
      {
        startTimestamp: new Date(),
        mintPrice: BigNumber.from(0),
        maxAllocationPerAddress: BigNumber.from(0),
      },
    ],
  ]),
  payoutData: {
    estimatedPayout: BigNumber.from(0),
    paymentReceiver: '0x' as `0x${string}`,
  },
  motionValues: {
    x: [null, null, null],
    opacity: [null, null, null],
  },
}

export const createContractCreationStore = create<ContractStoreInterface>()((set) => ({
  ...initialState,
  setMotionValue: (index: number, value: MotionValue, type: 'x' | 'opacity') => {
    set((state) => {
      const motionValues = state.motionValues
      motionValues[type][index] = value
      return { motionValues: motionValues }
    })
  },
  setSaleConfig: (type: SaleConfigType, data: SaleConfig) =>
    set((state) => {
      const saleConfig = state.saleConfig
      saleConfig.set(type, data)
      return { saleConfig: saleConfig }
    }),
  setContractInformationData: (data: ContractInformationData) => set({ contractInformationData: data }),
  setCurrentSegment: (segment: ContractCreationType) => set({ currentSegment: segment }),
}))

export const ContractContext = createContext<typeof createContractCreationStore>()
const useContractCreationStore = ContractContext.useStore

export default useContractCreationStore
