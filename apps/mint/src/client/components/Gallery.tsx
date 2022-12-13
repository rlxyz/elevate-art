import { CollectionLayout } from '@Components/CollectionLayout/CollectionLayout'
import { GalleryLayout } from '@Components/GalleryLayout/GalleryLayout'
import { MintPreviewWarningHeader } from '@Components/MintPreviewWarningHeader'
import { Layout } from '@Components/ui/core/Layout'
import { AssetDeploymentBranch } from '@prisma/client'
import { useRouter } from 'next/router'
import { useQueryContractDeployment } from 'src/client/hooks/useQueryContractDeployment'
import { OrganisationNavigationEnum } from './Mint'
import { PageRoutesNavbar } from './ui/header/PageRoutesNavbar'

export const Gallery = ({ type }: { type: AssetDeploymentBranch }) => {
  const router = useRouter()
  const { organisation, repository, address } = router.query as { [key: string]: string }
  const { current } = useQueryContractDeployment()
  return (
    <Layout>
      <Layout.Header
        internalRoutes={[
          {
            current: `${organisation}`,
            href: `/${organisation}`,
          },
          {
            current: `${repository}`,
            href: `/${organisation}/${repository}`,
          },
        ]}
      >
        <PageRoutesNavbar>
          {[
            {
              name: OrganisationNavigationEnum.enum.Mint,
              href:
                `/` +
                [
                  organisation,
                  repository,
                  type === AssetDeploymentBranch.PREVIEW && 'preview',
                  type === AssetDeploymentBranch.PREVIEW && address,
                  OrganisationNavigationEnum.enum.Mint,
                ]
                  .filter((x) => Boolean(x))
                  .join('/'),
              enabled: false,
              loading: false,
            },
            {
              name: OrganisationNavigationEnum.enum.Gallery,
              href:
                `/` +
                [
                  organisation,
                  repository,
                  type === AssetDeploymentBranch.PREVIEW && 'preview',
                  type === AssetDeploymentBranch.PREVIEW && address,
                  OrganisationNavigationEnum.enum.Gallery,
                ]
                  .filter((x) => Boolean(x))
                  .join('/'),
              enabled: true,
              loading: false,
            },
          ].map((item) => (
            <PageRoutesNavbar.Item key={item.name} opts={item} />
          ))}
        </PageRoutesNavbar>
      </Layout.Header>
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
