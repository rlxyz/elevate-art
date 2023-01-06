import { ContractInformationAnalyticsLayout } from '@components/explore/AnalyticsLayout/ContractInformationAnalyticsLayout'
import { ContractPayoutAnalyticsLayout } from '@components/explore/AnalyticsLayout/ContractPayoutAnalyticsLayout'
import { ContractSaleAnalyticsLayout } from '@components/explore/AnalyticsLayout/ContractSaleAnalyticsLayout'
import { ChevronLeftIcon } from '@heroicons/react/outline'
import { AssetDeploymentType } from '@prisma/client'
import type { ContractInformationData, PayoutData, SaleConfig } from '@utils/contracts/ContractData'
import clsx from 'clsx'
import { BigNumber } from 'ethers'
import type { ContractCreationType } from '.'
import { useAnimationMotionValues } from '../ContractCreationAnimation/useAnimationMotionValues'
import type { SaleConfigMap } from './useContractCreationStore'

export const ContractSummary = ({
  contractInformationData,
  saleConfig,
  presalePeriod,
  publicPeriod,
  payout,
  onClick,
  current,
  previous,
  next,
}: {
  onClick?: () => void
  previous: ContractCreationType | null
  current: ContractCreationType
  next: ContractCreationType | null
  payout?: PayoutData
  saleConfig?: SaleConfigMap
  contractInformationData?: ContractInformationData
  claimPeriod?: SaleConfig
  presalePeriod?: SaleConfig
  publicPeriod?: SaleConfig
}) => {
  const { handleClick } = useAnimationMotionValues()
  const contractInformation: ContractInformationData = contractInformationData || {
    name: '',
    symbol: '',
    owner: '0x' as `0x${string}`,
    mintType: AssetDeploymentType.BASIC,
    chainId: 99,
    totalSupply: BigNumber.from(0),
    collectionSize: BigNumber.from(0),
  }

  // const payout: PayoutData = payoutData || {
  //   estimatedPayout: BigNumber.from(0),
  //   paymentReceiver: '0x' as `0x${string}`,
  // }

  // const claimPeriod: SaleConfig = claimPeriodData || {
  //   startTimestamp: new Date(),
  //   mintPrice: BigNumber.from(0),
  //   maxAllocationPerAddress: BigNumber.from(0),
  // }

  // const presalePeriod: SaleConfig = presalePeriodData || {
  //   startTimestamp: new Date(),
  //   mintPrice: BigNumber.from(0),
  //   maxAllocationPerAddress: BigNumber.from(0),
  // }

  // const publicPeriod: SaleConfig = publicPeriodData || {
  //   startTimestamp: new Date(),
  //   mintPrice: BigNumber.from(0),
  //   maxAllocationPerAddress: BigNumber.from(0),
  // }

  return (
    <div className='w-full flex flex-col space-y-3'>
      <h1 className='text-xs font-semibold'>Finalise the Details</h1>
      <ContractInformationAnalyticsLayout contractInformationData={contractInformation} />
      {saleConfig &&
        Object.entries(saleConfig).map(([key, value]) => <ContractSaleAnalyticsLayout key={key} saleConfig={value} title={key} />)}
      <ContractPayoutAnalyticsLayout title={'Payout Details'} payoutData={payout} />

      <div className='grid grid-cols-8 gap-6'>
        {previous && (
          <button
            className='col-span-1 border rounded-[5px] border-mediumGrey p-2 flex'
            type='button'
            onClick={() => handleClick(previous)}
          >
            <ChevronLeftIcon className='w-4 h-4 text-darkGrey' />
          </button>
        )}
        {next && (
          <button
            className={clsx(
              previous ? 'col-span-7' : 'col-span-8',
              'border p-2 border-mediumGrey rounded-[5px] bg-black text-white text-xs disabled:bg-lightGray disabled:cursor-not-allowed disabled:text-darkGrey'
            )}
          >
            Continue
          </button>
        )}
      </div>
    </div>
  )
}
