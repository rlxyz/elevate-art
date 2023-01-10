import { Mint } from '@components/explore/Mint'
import { useQueryContractDeploymentProduction } from '@components/explore/SaleLayout/useQueryContractDeploymentProduction'
import { AssetDeploymentBranch } from '@prisma/client'
import type { NextPage } from 'next'

const Page: NextPage = () => {
  const { current } = useQueryContractDeploymentProduction()

  return <Mint branch={AssetDeploymentBranch.PRODUCTION} address={current?.address} />
}

export default Page
