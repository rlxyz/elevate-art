import { CollectionLayout } from '@Components/CollectionLayout/CollectionLayout'
import { GalleryLayout } from '@Components/GalleryLayout/GalleryLayout'
import { Layout } from '@Components/ui/core/Layout'
import { ContractDeploymentStatus } from '@prisma/client'
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

  if (!current || !current.deployment || !(current.deployment.status === ContractDeploymentStatus.DEPLOYED)) return <></>

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
            organisation={current?.deployment?.repository?.organisation}
            repository={current?.deployment?.repository}
            deployment={current?.deployment?.assetDeployment}
            contractDeployment={current?.deployment}
            contractData={current?.contract}
          />
          <CollectionLayout.Body>
            {current && current.deployment && current.deployment.assetDeployment && (
              <GalleryLayout
                organisation={current?.deployment?.repository?.organisation}
                repository={current?.deployment?.repository}
                assetDeployment={current?.deployment?.assetDeployment}
                contractDeployment={current?.deployment}
                contractData={current?.contract}
              />
            )}
          </CollectionLayout.Body>
        </CollectionLayout>
      </Layout.Body>
    </Layout>
  )
}

export default HomePage
