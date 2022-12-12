import { SaleLayoutAllowlistChecker } from '@Components/SaleLayout/SaleLayoutAllowlistChecker'
import { SaleLayoutPresalePurchase } from '@Components/SaleLayout/SaleLayoutPresalePurchase'
import { SaleLayoutPublicPurchase } from '@Components/SaleLayout/SaleLayoutPublicPurchase'
import type { RepositoryContractDeployment } from '@prisma/client'
import { useSession } from 'next-auth/react'
import type { ContractData } from 'src/pages/[address]'

export const MintLayout = ({
  contractDeployment,
  contractData,
}: {
  contractDeployment: RepositoryContractDeployment
  contractData: ContractData
}) => {
  const { data } = useSession()
  const now = new Date()
  return (
    <div className='space-y-6'>
      {now < contractData.presaleTime && <SaleLayoutAllowlistChecker />}
      {now > contractData.presaleTime && now < contractData.publicTime && (
        <SaleLayoutPresalePurchase session={data} contractData={contractData} contractDeployment={contractDeployment} />
      )}
      {now > contractData.publicTime && (
        <SaleLayoutPublicPurchase session={data} contractDeployment={contractDeployment} contractData={contractData} />
      )}
    </div>
  )
}
