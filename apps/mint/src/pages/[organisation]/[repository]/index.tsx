import { AnalyticsLayoutCollectionInformation } from '@Components/AnalyticsLayout/AnalyticsLayoutCollectionInformation'
import { CollectionLayout } from '@Components/CollectionLayout/CollectionLayout'
import { MintLayout } from '@Components/MintLayout/MintLayout'
import { SaleLayoutLoading } from '@Components/SaleLayout/SaleLayoutLoading'
import { Layout } from '@Components/ui/core/Layout'
import { useRouter } from 'next/router'
import { useQueryContractDeployment } from 'src/client/hooks/useQueryContractDeployment'

export const HomePage = () => {
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
