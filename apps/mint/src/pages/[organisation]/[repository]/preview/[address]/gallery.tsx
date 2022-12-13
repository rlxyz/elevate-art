import { CollectionLayout } from '@Components/CollectionLayout/CollectionLayout'
import { GalleryLayout } from '@Components/GalleryLayout/GalleryLayout'
import { MintPreviewWarningHeader } from '@Components/MintPreviewWarningHeader'
import { Layout } from '@Components/ui/core/Layout'
import type { GetServerSidePropsContext, NextPage } from 'next'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useQueryContractDeployment } from 'src/client/hooks/useQueryContractDeployment'
import { env } from 'src/env/client.mjs'

export const Page: NextPage = () => {
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
          {current && current.deployment && current.deployment.assetDeployment && (
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

/**
 * If user is authenticated, redirect the user to his contract deployment.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { address } = context.query as { [key: string]: string }
  const session = await getSession(context)
  if (!address || !session?.user) {
    return {
      redirect: {
        destination: `${env.NEXT_PUBLIC_COMPILER_CLIENT_URL}`,
        permanant: false,
      },
    }
  }

  const valid = await prisma?.contractDeployment.findFirst({
    where: {
      address,
      repository: {
        organisation: {
          members: {
            some: {
              user: {
                id: session.user.id,
              },
            },
          },
        },
      },
    },
  })

  if (!valid) {
    return {
      redirect: {
        destination: `${env.NEXT_PUBLIC_COMPILER_CLIENT_URL}`,
        permanant: false,
      },
    }
  }

  return {
    props: {},
  }
}

export default Page
