import { SaleLayoutAllowlistChecker } from '@Components/SaleLayout/SaleLayoutAllowlistChecker'
import { SaleLayoutPresalePurchase } from '@Components/SaleLayout/SaleLayoutPresalePurchase'
import { SaleLayoutPublicPurchase } from '@Components/SaleLayout/SaleLayoutPublicPurchase'
import type { ContractDeployment } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { ContractData } from 'src/pages/[organisation]/[repository]/preview/ContractData'

export const MintLayout = ({
  contractDeployment,
  contractData,
}: {
  contractDeployment: ContractDeployment
  contractData: ContractData
}) => {
  const { data } = useSession()
  const now = new Date()
  return (
    <div className='s/pace-y-6'>
      {now < contractData.presaleTime && <SaleLayoutAllowlistChecker contractData={contractData} />}
      {now > contractData.presaleTime && now < contractData.publicTime && (
        <SaleLayoutPresalePurchase session={data} contractData={contractData} contractDeployment={contractDeployment} />
      )}
      {now > contractData.publicTime && (
        <SaleLayoutPublicPurchase session={data} contractDeployment={contractDeployment} contractData={contractData} />
      )}
    </div>
  )
}
