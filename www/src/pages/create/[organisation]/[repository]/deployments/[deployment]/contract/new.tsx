import { ContractCreationFormDisplay } from '@components/contractDeployment/ContractCreationFormDisplay'
import { ContractCreationHelperAnimation } from '@components/contractDeployment/ContractCreationHelperAnimation'
import { PageRoutesNavbar } from '@components/layout/header/PageRoutesNavbar'
import withOrganisationStore from '@components/withOrganisationStore'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import { useQueryRepositoryDeployments } from '@hooks/trpc/repositoryDeployment/useQueryRepositoryDeployments'
import { useRepositoryRoute } from '@hooks/utils/useRepositoryRoute'
import { CollectionNavigationEnum, DeploymentNavigationEnum } from '@utils/enums'
import type { GetServerSidePropsContext } from 'next'
import { useEffect } from 'react'
import { Layout } from 'src/client/components/layout/core/Layout'
import { OrganisationAuthLayout } from 'src/client/components/organisation/OrganisationAuthLayout'
import { env } from 'src/env/client.mjs'

const Page = () => {
  const { all: organisations } = useQueryOrganisationFindAll()
  const { mainRepositoryHref, repositoryName, organisationName, deploymentName } = useRepositoryRoute()
  const { current: deployment } = useQueryRepositoryDeployments()
  const { setDeploymentId } = useRepositoryStore()

  useEffect(() => {
    if (!deployment?.id) return
    setDeploymentId(deployment.id)
  }, [deployment?.id])

  return (
    <OrganisationAuthLayout>
      <Layout hasFooter={false}>
        <Layout.AppHeader
          internalRoutes={[
            { current: organisationName, href: `/${env.NEXT_PUBLIC_CREATE_CLIENT_BASE_PATH}/${organisationName}`, organisations },
            { current: repositoryName, href: `/${env.NEXT_PUBLIC_CREATE_CLIENT_BASE_PATH}/${organisationName}/${repositoryName}` },
            {
              current: deploymentName,
              href: `/${env.NEXT_PUBLIC_CREATE_CLIENT_BASE_PATH}/${organisationName}/${repositoryName}/deployments/${deploymentName}`,
            },
          ]}
        >
          <PageRoutesNavbar>
            {[
              {
                name: DeploymentNavigationEnum.enum.Deployment,
                href: `/${mainRepositoryHref}/${CollectionNavigationEnum.enum.Deployments}/${deploymentName}`,
                enabled: false,
                loading: false,
              },
              {
                name: DeploymentNavigationEnum.enum.Contract,
                href: `/${mainRepositoryHref}/${CollectionNavigationEnum.enum.Deployments}/${deploymentName}/contract`,
                enabled: true,
                loading: false,
              },
            ].map((item) => (
              <PageRoutesNavbar.Item key={item.name} opts={item} />
            ))}
          </PageRoutesNavbar>
        </Layout.AppHeader>
        <Layout.Body border={'lower'}>
          <ContractCreationHelperAnimation className='py-16' />
          <ContractCreationFormDisplay className='h-[calc(100vh-17.75rem)] py-8' />
        </Layout.Body>
      </Layout>
    </OrganisationAuthLayout>
  )
}

export default withOrganisationStore(Page)

/**
 * If user is authenticated, redirect the user to his dashboard.
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { organisation, repository, deployment } = context.query as { [key: string]: string }

  if (!organisation || !repository || !deployment) {
    return { props: {} }
  }

  const valid = await prisma?.contractDeployment.findFirst({
    where: {
      assetDeployment: {
        name: deployment,
        repository: {
          name: repository,
          organisation: {
            name: organisation,
          },
        },
      },
    },
  })

  if (valid) {
    return {
      redirect: {
        destination: `/${env.NEXT_PUBLIC_CREATE_CLIENT_BASE_PATH}/${organisation}/${repository}/deployments/${deployment}/contract`,
        permanant: false,
      },
    }
  }

  return { props: {} }
}
