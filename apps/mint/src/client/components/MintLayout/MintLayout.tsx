import { CollectorAnalytics } from '@Components/core/CollectorAnalytics'
import { MetadataAnalytics } from '@Components/core/MetadataAnalytics'
import { SaleLayoutAllowlistChecker } from '@Components/SaleLayout/SaleLayoutAllowlistChecker'
import { SaleLayoutPresalePurchase } from '@Components/SaleLayout/SaleLayoutPresalePurchase'
import { SaleLayoutPublicPurchase } from '@Components/SaleLayout/SaleLayoutPublicPurchase'
import type { RepositoryContractDeployment } from '@prisma/client'

export const MintLayout = ({ contractDeployment }: { contractDeployment: RepositoryContractDeployment }) => (
  <div className='w-full justify-center flex flex-col gap-6 md:grid md:grid-flow-col md:grid-cols-2'>
    <div className='space-y-6'>
      <SaleLayoutAllowlistChecker />
      <SaleLayoutPresalePurchase />
      <SaleLayoutPublicPurchase />
    </div>
    <div className='flex flex-col space-y-6'>
      <MetadataAnalytics contractDeployment={contractDeployment} />
      <CollectorAnalytics contractDeployment={contractDeployment} />
    </div>
  </div>
)
