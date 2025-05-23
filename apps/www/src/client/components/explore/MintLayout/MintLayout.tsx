import type { ContractDeployment } from '@prisma/client'
import { ContractDeploymentAllowlistType } from '@prisma/client'
import { useSession } from 'next-auth/react'
import type { RhapsodyContractData } from '../../../../shared/contracts/ContractData'
import { AnalyticsLayoutCollectionInformation } from '../AnalyticsLayout/AnalyticsLayoutCollectionInformation'
import { SaleLayoutClaimChecker } from '../SaleLayout/SaleLayoutClaimChecker'
import { SaleLayoutClaimPurchase } from '../SaleLayout/SaleLayoutClaimPurchase'
import { SaleLayoutPublicPurchase } from '../SaleLayout/SaleLayoutPublicPurchase'
import { MintOwnedCard } from './MintOwnedCard'
import { MintSyncedCard } from './MintSyncedCard'

export const MintLayout = ({
  contractDeployment,
  contractData,
}: {
  contractDeployment: ContractDeployment
  contractData: RhapsodyContractData
}) => {
  const { data } = useSession()
  return (
    <>
      <main className='space-y-6'>
        {data && <MintOwnedCard contractDeployment={contractDeployment} session={data} />}
        <SaleLayoutClaimPurchase session={data} contractData={contractData} contractDeployment={contractDeployment} />
        <SaleLayoutPublicPurchase session={data} contractData={contractData} contractDeployment={contractDeployment} />
        {/* {now < contractData.publicPeriod.startTimestamp && (
          )}
          {now > contractData.publicPeriod.startTimestamp && (
          )} */}
        {/* {now > contractData.presalePeriod.startTimestamp && now < contractData.publicPeriod.startTimestamp && (
          <>
          <MintSyncedCard contractDeployment={contractDeployment} allowlistType={ContractDeploymentAllowlistType.PRESALE} />
          <SaleLayoutPresalePurchase session={data} contractData={contractData} contractDeployment={contractDeployment} />
          </>
        )} */}
      </main>
      <article className='space-y-6'>
        <MintSyncedCard contractDeployment={contractDeployment} allowlistType={ContractDeploymentAllowlistType.CLAIM} />
        <SaleLayoutClaimChecker contractData={contractData} />
        {/* {now < contractData.publicPeriod.startTimestamp && <SaleLayoutPresaleChecker contractData={contractData} />} */}
        <AnalyticsLayoutCollectionInformation contractDeployment={contractDeployment} />
        {/* <AnalyticsLayoutCollectorData contractDeployment={contractDeployment} /> */}
      </article>
    </>
  )
}
