import { ContractCreation } from '@components/deployments/contractDeployment'
import { FilterWithTextLive } from '@components/layout/FilterWithTextLive'
import AppRoutesNavbar, { ZoneRoutesNavbarPopover } from '@components/layout/header/AppRoutesNavbarProps'
import { TriangleIcon } from '@components/layout/icons/RectangleGroup'
import { TextWithStatus } from '@components/layout/TextWithStatus'
import { OrganisationRoutesNavbarPopover } from '@components/organisation/OrganisationRoutesNavbar'
import withOrganisationStore from '@components/withOrganisationStore'
import { CubeIcon } from '@heroicons/react/outline'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import { useQueryRepositoryFindByName } from '@hooks/trpc/repository/useQueryRepositoryFindByName'
import { useQueryRepositoryHasProductionDeployment } from '@hooks/trpc/repository/useQueryRepositoryHasProductionDeployment'
import { useQueryRepositoryDeployments } from '@hooks/trpc/repositoryDeployment/useQueryRepositoryDeployments'
import { ZoneNavigationEnum } from '@utils/enums'
import type { GetServerSidePropsContext } from 'next'
import { useEffect } from 'react'
import { Layout } from 'src/client/components/layout/core/Layout'
import { OrganisationAuthLayout } from 'src/client/components/organisation/OrganisationAuthLayout'
import { capitalize, routeBuilder } from 'src/client/utils/format'

const Page = () => {
  const { current: deployment, isLoading: isLoading } = useQueryRepositoryDeployments()
  const { current: organisation } = useQueryOrganisationFindAll()
  const { setDeploymentId } = useRepositoryStore()
  const { current: hasProductionDeployment } = useQueryRepositoryHasProductionDeployment()
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
            <AppRoutesNavbar.Item label={organisation?.name || ''} href={routeBuilder(organisation?.name)} loading={!organisation?.name}>
              <OrganisationRoutesNavbarPopover />
            </AppRoutesNavbar.Item>
            <AppRoutesNavbar.Item
              label={repository?.name || ''}
              href={routeBuilder(organisation?.name, repository?.name)}
              loading={!organisation?.name || !repository?.name}
              disabled={!hasProductionDeployment}
            >
              <FilterWithTextLive />
            </AppRoutesNavbar.Item>
            <AppRoutesNavbar.Item
              label={capitalize(ZoneNavigationEnum.enum.Deployments)}
              href={routeBuilder(organisation?.name, repository?.name, ZoneNavigationEnum.enum.Deployments)}
            >
              <ZoneRoutesNavbarPopover
                title='Apps'
                routes={[
                  {
                    label: capitalize(ZoneNavigationEnum.enum.Create),
                    href: routeBuilder(organisation?.name, repository?.name, ZoneNavigationEnum.enum.Create),
                    selected: false,
                    icon: (props: any) => <TriangleIcon className='w-4 h-4' />,
                  },
                  {
                    label: capitalize(ZoneNavigationEnum.enum.Deployments),
                    href: routeBuilder(organisation?.name, repository?.name, ZoneNavigationEnum.enum.Deployments),
                    selected: true,
                    icon: (props: any) => <CubeIcon className='w-4 h-4' />,
                  },
                ]}
              />
            </AppRoutesNavbar.Item>
            <AppRoutesNavbar.Item
              label={<TextWithStatus name={deployment?.name} />}
              href={routeBuilder(organisation?.name, repository?.name, ZoneNavigationEnum.enum.Deployments, deployment?.name)}
            />
          </AppRoutesNavbar>
        </Layout.AppHeader>
        <Layout.Body border={'lower'}>
          <ContractCreation />
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
        destination: routeBuilder(organisation, repository, ZoneNavigationEnum.enum.Deployments, deployment),
        permanant: false,
      },
    }
  }

  return { props: {} }
}
