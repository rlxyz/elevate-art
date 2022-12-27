import type { ContractDeployment } from '@prisma/client'
import { useSession } from 'next-auth/react'
import type { ContractData } from '../ContractData'
import { SaleLayoutAllowlistChecker } from '../SaleLayout/SaleLayoutAllowlistChecker'
import { SaleLayoutPresalePurchase } from '../SaleLayout/SaleLayoutPresalePurchase'
import { SaleLayoutPublicPurchase } from '../SaleLayout/SaleLayoutPublicPurchase'

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
