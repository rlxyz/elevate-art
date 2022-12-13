import { AnalyticsLayoutCollectionInformation } from '@Components/AnalyticsLayout/AnalyticsLayoutCollectionInformation'
import { CollectionLayout } from '@Components/CollectionLayout/CollectionLayout'
import { MintLayout } from '@Components/MintLayout/MintLayout'
import { MintPreviewWarningHeader } from '@Components/MintPreviewWarningHeader'
import { SaleLayoutLoading } from '@Components/SaleLayout/SaleLayoutLoading'
import { Layout } from '@Components/ui/core/Layout'
import { AssetDeploymentBranch } from '@prisma/client'
import { useRouter } from 'next/router'
import { useQueryContractDeployment } from 'src/client/hooks/useQueryContractDeployment'

export const Mint = ({ type }: { type: AssetDeploymentBranch }) => {
  const router = useRouter()
  const { organisation, repository } = router.query as { [key: string]: string }
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
