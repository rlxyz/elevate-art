import Card from '@components/layout/card/Card'
import { ExclamationCircleIcon } from '@heroicons/react/outline'
import type { ContractDeployment } from '@prisma/client'
import { ContractDeploymentAllowlistType } from '@prisma/client'
import { useSession } from 'next-auth/react'
import type { RhapsodyContractData } from '../../../../shared/contracts/ContractData'
import { AnalyticsLayoutCollectionInformation } from '../AnalyticsLayout/AnalyticsLayoutCollectionInformation'
import { SaleLayoutClaimChecker } from '../SaleLayout/SaleLayoutClaimChecker'
import { SaleLayoutClaimPurchase } from '../SaleLayout/SaleLayoutClaimPurchase'
import { SaleLayoutPresaleChecker } from '../SaleLayout/SaleLayoutPresaleChecker'
import { SaleLayoutPresalePurchase } from '../SaleLayout/SaleLayoutPresalePurchase'
import { SaleLayoutPublicPurchase } from '../SaleLayout/SaleLayoutPublicPurchase'
import { useFetchContractMerkleRootData } from '../SaleLayout/useFetchContractMerkleRootData'
import { useUserMerkleProof } from '../SaleLayout/useUserMerkleProof'
import { useMintLayoutCurrentTime } from './useMintLayoutCurrentTime'

const MintSyncedCard = ({
  contractDeployment,
  allowlistType,
}: {
  contractDeployment: ContractDeployment
  allowlistType: ContractDeploymentAllowlistType
}) => {
  const { root } = useUserMerkleProof({ type: ContractDeploymentAllowlistType.CLAIM })
  const { data: merkleRootData } = useFetchContractMerkleRootData({
    version: '0.1.0',
    contractAddress: contractDeployment.address,
    chainId: contractDeployment.chainId,
  })

  if (root === merkleRootData?.claimMerkleRoot) return null
  return (
    <Card className='text-xs text-redError'>
      <div className='flex space-x-2 items-center'>
        <ExclamationCircleIcon className='w-4 h-4 text-redError' />
        <span>The owner of the contract is updating the mint, please be patient. The mint will resume shortly.</span>
      </div>
    </Card>
  )
}

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
          <>
            <MintSyncedCard contractDeployment={contractDeployment} allowlistType={ContractDeploymentAllowlistType.CLAIM} />
            <SaleLayoutClaimPurchase session={data} contractData={contractData} contractDeployment={contractDeployment} />
          </>
        )}
        {now > contractData.presalePeriod.startTimestamp && now < contractData.publicPeriod.startTimestamp && (
          <>
            <MintSyncedCard contractDeployment={contractDeployment} allowlistType={ContractDeploymentAllowlistType.PRESALE} />
            <SaleLayoutPresalePurchase session={data} contractData={contractData} contractDeployment={contractDeployment} />
          </>
        )}
        {now > contractData.publicPeriod.startTimestamp && (
          <SaleLayoutPublicPurchase session={data} contractDeployment={contractDeployment} contractData={contractData} />
        )}
      </main>
      <article className='space-y-6'>
        {now < contractData.presalePeriod.startTimestamp && <SaleLayoutClaimChecker contractData={contractData} />}
        {now < contractData.publicPeriod.startTimestamp && <SaleLayoutPresaleChecker contractData={contractData} />}
        <AnalyticsLayoutCollectionInformation contractDeployment={contractDeployment} />
        {/* <AnalyticsLayoutCollectorData contractDeployment={contractDeployment} /> */}
      </article>
    </>
  )
}
