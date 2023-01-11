import { Gallery } from '@components/explore/Gallery'
import { useQueryContractDeploymentProduction } from '@components/explore/SaleLayout/useQueryContractDeploymentProduction'
import { AssetDeploymentBranch } from '@prisma/client'
import type { NextPage } from 'next'

const Page: NextPage = () => {
  const { current } = useQueryContractDeploymentProduction({})

  return <Gallery branch={AssetDeploymentBranch.PRODUCTION} address={current?.address} />
}

export default Page
