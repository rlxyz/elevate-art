import { PageRoutesNavbar } from '@components/layout/header/PageRoutesNavbar'
import {
  ContractCreationHelperAnimation,
  ContractCreationSegments,
} from '@components/repository/RepsitoryContractDeployment/useContractCreationStore'
import { useContractCreationStore } from '@components/repository/RepsitoryContractDeployment/useContractCreationStore.1'
import withOrganisationStore from '@components/withOrganisationStore'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import { useRepositoryRoute } from '@hooks/utils/useRepositoryRoute'
import clsx from 'clsx'
import { Layout } from 'src/client/components/layout/core/Layout'
import { OrganisationAuthLayout } from 'src/client/components/organisation/OrganisationAuthLayout'
import { CollectionNavigationEnum, DeploymentNavigationEnum } from 'src/shared/enums'

const Page = () => {
  // const { all: contractDeployment } = useQueryRepositoryContractDeployment()
  const { all: organisations } = useQueryOrganisationFindAll()
  const { mainRepositoryHref, repositoryName, organisationName, deploymentName } = useRepositoryRoute()
  const { currentSegment } = useContractCreationStore()

  return (
    <OrganisationAuthLayout>
      <Layout>
        <Layout.Header
          internalRoutes={[
            { current: organisationName, href: `/${organisationName}`, organisations },
            { current: repositoryName, href: `/${organisationName}/${repositoryName}` },
            { current: deploymentName, href: `/${organisationName}/${repositoryName}/deployments/${deploymentName}` },
          ]}
        >
          <PageRoutesNavbar>
            {[
              {
                name: DeploymentNavigationEnum.enum.Overview,
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
        </Layout.Header>
        <Layout.Body border='none'>
          <div className='min-h-[calc(100vh-9.14rem)] flex flex-col my-16'>
            <div className='flex h-full flex-col items-center w-full space-y-9'>
              <ContractCreationHelperAnimation />
              {ContractCreationSegments.map((item, index) => (
                <div
                  key={item.id}
                  className={clsx(currentSegment !== index && 'hidden', 'w-full flex flex-col items-center space-y-9 w-3/4')}
                >
                  <item.component />
                </div>
              ))}
            </div>
          </div>
        </Layout.Body>
      </Layout>
    </OrganisationAuthLayout>
  )
}

export default withOrganisationStore(Page)
