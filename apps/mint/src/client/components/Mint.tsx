import { AnalyticsLayoutCollectionInformation } from '@Components/AnalyticsLayout/AnalyticsLayoutCollectionInformation'
import { CollectionLayout } from '@Components/CollectionLayout/CollectionLayout'
import { MintLayout } from '@Components/MintLayout/MintLayout'
import { MintPreviewWarningHeader } from '@Components/MintPreviewWarningHeader'
import { SaleLayoutLoading } from '@Components/SaleLayout/SaleLayoutLoading'
import { Layout } from '@Components/ui/core/Layout'
import { AssetDeploymentBranch } from '@prisma/client'
import { useRouter } from 'next/router'
import { useQueryContractDeployment } from 'src/client/hooks/useQueryContractDeployment'
import { z } from 'zod'
import { PageRoutesNavbar } from './ui/header/PageRoutesNavbar'

export const OrganisationNavigationEnum = z.nativeEnum(
  Object.freeze({
    Overview: 'overview',
    Mint: 'mint', // only for personal accounts
    Gallery: 'gallery', // only for personal accounts
  })
)
export type OrganisationNavigationType = z.infer<typeof OrganisationNavigationEnum>

export const Mint = ({ type }: { type: AssetDeploymentBranch }) => {
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
              enabled: true,
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
              enabled: false,
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
            organisation={current?.deployment?.repository.organisation}
            repository={current?.deployment?.repository}
            deployment={current?.deployment?.assetDeployment}
            contractDeployment={current?.deployment}
            contractData={current?.contract}
          />
          <CollectionLayout.Body>
            <div className='w-full justify-center flex flex-col gap-6 md:grid md:grid-flow-col md:grid-cols-2'>
              {!current?.contract || !current.deployment ? (
                <>
                  <SaleLayoutLoading />
                  <SaleLayoutLoading />
                </>
              ) : (
                <>
                  <main>
                    <MintLayout contractData={current?.contract} contractDeployment={current?.deployment} />
                  </main>
                  <article className='flex flex-col space-y-6'>
                    <AnalyticsLayoutCollectionInformation contractDeployment={current?.deployment} />
                    {/* <AnalyticsLayoutCollectorData contractDeployment={deployment} /> */}
                  </article>
                </>
              )}
            </div>
          </CollectionLayout.Body>
        </CollectionLayout>
      </Layout.Body>
    </Layout>
  )
}
