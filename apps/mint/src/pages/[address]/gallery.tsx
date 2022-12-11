import { CollectionLayout } from '@Components/CollectionLayout/CollectionLayout'
import { GalleryLayout } from '@Components/GalleryLayout/GalleryLayout'
import { Layout } from '@Components/ui/core/Layout'
import { RepositoryContractDeploymentStatus } from '@prisma/client'
import LogRocket from 'logrocket'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useQueryContractDeployment } from 'src/client/hooks/useQueryContractDeployment'
import { useAccount } from 'wagmi'

export const HomePage = () => {
  const router = useRouter()
  const address = router.query.address as string
  const { current } = useQueryContractDeployment()
  const account = useAccount()
  useEffect(() => {
    if (account?.address) {
      LogRocket.identify(account?.address)
    }
  }, [account?.address])

  if (!current || !current.deployment || !(current.deployment.status === RepositoryContractDeploymentStatus.DEPLOYED)) return <></>

  const { deployment, contract: contractData } = current

  return (
    <Layout>
      <Layout.Header
        internalRoutes={[
          {
            current: `${address}`,
            href: `/${address}`,
          },
        ]}
      />
      <Layout.Body margin={false}>
        <CollectionLayout>
          <CollectionLayout.Header contractDeployment={deployment} />
          <CollectionLayout.Description
            organisation={deployment.repository.organisation}
            repository={deployment.repository}
            deployment={deployment.repositoryDeployment} // @todo fix
            contractDeployment={deployment}
            contractData={contractData}
          />
          <CollectionLayout.Body>
            <GalleryLayout
              contractDeployment={deployment}
              repositoryDeployment={deployment.repositoryDeployment}
              repository={deployment.repository}
              organisation={deployment.repository.organisation}
              contractData={contractData}
            />
          </CollectionLayout.Body>
        </CollectionLayout>
      </Layout.Body>
    </Layout>
  )
}

export default HomePage
