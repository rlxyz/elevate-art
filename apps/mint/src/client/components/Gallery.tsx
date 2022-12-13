import { CollectionLayout } from '@Components/CollectionLayout/CollectionLayout'
import { GalleryLayout } from '@Components/GalleryLayout/GalleryLayout'
import { MintPreviewWarningHeader } from '@Components/MintPreviewWarningHeader'
import { Layout } from '@Components/ui/core/Layout'
import { AssetDeploymentBranch } from '@prisma/client'
import { useRouter } from 'next/router'
import { useQueryContractDeployment } from 'src/client/hooks/useQueryContractDeployment'

export const Gallery = ({ type }: { type: AssetDeploymentBranch }) => {
  const router = useRouter()
  const address = router.query.address as string
  const { current } = useQueryContractDeployment()
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
        <>
          {type === AssetDeploymentBranch.PREVIEW && current && current.deployment && current.deployment.assetDeployment && (
            <MintPreviewWarningHeader
              organisation={current.deployment.repository.organisation}
              repository={current.deployment.repository}
              assetDeployment={current.deployment.assetDeployment}
              contractDeployment={current.deployment}
            />
          )}
        </>

        <CollectionLayout>
          <CollectionLayout.Header contractDeployment={current?.deployment} />
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
