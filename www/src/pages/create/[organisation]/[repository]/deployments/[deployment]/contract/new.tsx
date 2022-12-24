import { ContractCreationFormDisplay } from '@components/contractDeployment/ContractCreationFormDisplay'
import { ContractCreationHelperAnimation } from '@components/contractDeployment/ContractCreationHelperAnimation'
import AppRoutesNavbar, { ZoneRoutesNavbarPopover } from '@components/layout/header/AppRoutesNavbarProps'
import { PageRoutesNavbar } from '@components/layout/header/PageRoutesNavbar'
import { TriangleIcon } from '@components/layout/icons/RectangleGroup'
import { OrganisationRoutesNavbarPopover } from '@components/organisation/OrganisationRoutesNavbar'
import withOrganisationStore from '@components/withOrganisationStore'
import { CubeIcon, GlobeAltIcon } from '@heroicons/react/outline'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import { useQueryRepositoryFindByName } from '@hooks/trpc/repository/useQueryRepositoryFindByName'
import { useQueryRepositoryDeployments } from '@hooks/trpc/repositoryDeployment/useQueryRepositoryDeployments'
import { CollectionNavigationEnum, DeploymentNavigationEnum, ZoneNavigationEnum } from '@utils/enums'
import type { GetServerSidePropsContext } from 'next'
import { useEffect } from 'react'
import { Layout } from 'src/client/components/layout/core/Layout'
import { OrganisationAuthLayout } from 'src/client/components/organisation/OrganisationAuthLayout'
import { capitalize, routeBuilder } from 'src/client/utils/format'
import { env } from 'src/env/client.mjs'

const Page = () => {
  const { current: deployment, isLoading: isLoading } = useQueryRepositoryDeployments()
  const { current: organisation } = useQueryOrganisationFindAll()
  const { setDeploymentId } = useRepositoryStore()

  const { current: repository, isLoading: isLoadingRepository } = useQueryRepositoryFindByName()
  const setRepositoryId = useRepositoryStore((state) => state.setRepositoryId)
  useEffect(() => {
    if (!repository) return
    setRepositoryId(repository.id)
  }, [isLoadingRepository])

  useEffect(() => {
    if (!deployment?.id) return
    setDeploymentId(deployment.id)
  }, [deployment?.id])

  return (
    <OrganisationAuthLayout>
      <Layout hasFooter={false}>
        <Layout.AppHeader>
          <AppRoutesNavbar>
            <AppRoutesNavbar.Item label={capitalize(ZoneNavigationEnum.enum.Create)} href={`/${ZoneNavigationEnum.enum.Create}`}>
              <ZoneRoutesNavbarPopover
                title='Apps'
                routes={[
                  {
                    label: capitalize(ZoneNavigationEnum.enum.Dashboard),
                    href: `/${ZoneNavigationEnum.enum.Dashboard}`,
                    selected: false,
                    icon: (props: any) => <CubeIcon className='w-4 h-4' />,
                  },
                  {
                    label: capitalize(ZoneNavigationEnum.enum.Create),
                    href: `/${ZoneNavigationEnum.enum.Create}`,
                    selected: true,
                    icon: (props: any) => <TriangleIcon className='w-4 h-4' />,
                  },
                  {
                    label: capitalize(ZoneNavigationEnum.enum.Explore),
                    href: `/${ZoneNavigationEnum.enum.Explore}`,
                    selected: false,
                    icon: (props: any) => <GlobeAltIcon className='w-4 h-4' />,
                  },
                ]}
              />
            </AppRoutesNavbar.Item>
            <AppRoutesNavbar.Item
              label={organisation?.name || ''}
              href={routeBuilder(env.NEXT_PUBLIC_CREATE_CLIENT_BASE_PATH, organisation?.name)}
            >
              <OrganisationRoutesNavbarPopover />
            </AppRoutesNavbar.Item>
            <AppRoutesNavbar.Item
              label={repository?.name || ''}
              href={routeBuilder(env.NEXT_PUBLIC_CREATE_CLIENT_BASE_PATH, organisation?.name, repository?.name)}
            />
            <AppRoutesNavbar.Item
              label={deployment?.name || ''}
              href={routeBuilder(
                env.NEXT_PUBLIC_CREATE_CLIENT_BASE_PATH,
                organisation?.name,
                repository?.name,
                CollectionNavigationEnum.enum.Deployments,
                deployment?.name
              )}
            />
          </AppRoutesNavbar>
        </Layout.AppHeader>
        <Layout.PageHeader>
          <PageRoutesNavbar>
            {[
              {
                name: DeploymentNavigationEnum.enum.Deployment,
                href: routeBuilder(
                  env.NEXT_PUBLIC_CREATE_CLIENT_BASE_PATH,
                  organisation?.name,
                  repository?.name,
                  CollectionNavigationEnum.enum.Deployments,
                  deployment?.name
                ),
                enabled: false,
                loading: isLoading,
              },
              {
                name: DeploymentNavigationEnum.enum.Contract,
                href: routeBuilder(
                  env.NEXT_PUBLIC_CREATE_CLIENT_BASE_PATH,
                  organisation?.name,
                  repository?.name,
                  CollectionNavigationEnum.enum.Deployments,
                  deployment?.name,
                  DeploymentNavigationEnum.enum.Contract
                ),
                enabled: true,
                loading: isLoading,
              },
            ].map((item) => (
              <PageRoutesNavbar.Item key={item.name} opts={item} />
            ))}
          </PageRoutesNavbar>
        </Layout.PageHeader>
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
