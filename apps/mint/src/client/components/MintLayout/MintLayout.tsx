import { SaleLayoutAllowlistChecker } from '@Components/SaleLayout/SaleLayoutAllowlistChecker'
import { SaleLayoutPresalePurchase } from '@Components/SaleLayout/SaleLayoutPresalePurchase'
import { SaleLayoutPublicPurchase } from '@Components/SaleLayout/SaleLayoutPublicPurchase'
import type { RepositoryContractDeployment } from '@prisma/client'

export const MintLayout = ({ contractDeployment }: { contractDeployment: RepositoryContractDeployment }) => (
  <div className='space-y-6'>
    <SaleLayoutAllowlistChecker />
    <SaleLayoutPresalePurchase />
    <SaleLayoutPublicPurchase />
  </div>
)
