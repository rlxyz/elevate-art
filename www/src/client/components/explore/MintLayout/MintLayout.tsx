import type { ContractDeployment } from '@prisma/client'
import { useSession } from 'next-auth/react'
import type { RhapsodyContractData } from '../../../../shared/contracts/ContractData'
import { SaleLayoutClaimChecker } from '../SaleLayout/SaleLayoutClaimChecker'
import { SaleLayoutClaimPurchase } from '../SaleLayout/SaleLayoutClaimPurchase'
import { SaleLayoutPresaleChecker } from '../SaleLayout/SaleLayoutPresaleChecker'
import { SaleLayoutPresalePurchase } from '../SaleLayout/SaleLayoutPresalePurchase'
import { SaleLayoutPublicPurchase } from '../SaleLayout/SaleLayoutPublicPurchase'
import { useMintLayoutCurrentTime } from './useMintLayoutCurrentTime'

export const MintLayout = ({
  contractDeployment,
  contractData,
}: {
  contractDeployment: ContractDeployment
  contractData: RhapsodyContractData
}) => {
  const { data } = useSession()
  const { now } = useMintLayoutCurrentTime()
  return (
    <>
      <main className='space-y-6'>
        {now < contractData.presalePeriod.startTimestamp && (
          <SaleLayoutClaimPurchase session={data} contractData={contractData} contractDeployment={contractDeployment} />
        )}
        {now > contractData.presalePeriod.startTimestamp && now < contractData.publicPeriod.startTimestamp && (
          <SaleLayoutPresalePurchase session={data} contractData={contractData} contractDeployment={contractDeployment} />
        )}
        {now > contractData.publicPeriod.startTimestamp && (
          <SaleLayoutPublicPurchase session={data} contractDeployment={contractDeployment} contractData={contractData} />
        )}
      </main>
      <article className='space-y-6'>
        {now < contractData.presalePeriod.startTimestamp && <SaleLayoutClaimChecker contractData={contractData} />}
        {now < contractData.publicPeriod.startTimestamp && <SaleLayoutPresaleChecker contractData={contractData} />}
        {/* <AnalyticsLayoutCollectionInformation contractDeployment={contractDeployment} /> */}
        {/* <AnalyticsLayoutCollectorData contractDeployment={contractDeployment} /> */}
      </article>
    </>
  )
}
