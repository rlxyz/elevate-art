import { ContractCreationFormDisplay } from '@components/repository/RepsitoryContractDeployment/ContractCreationFormDisplay'
import { ContractCreationHelperAnimation } from '@components/repository/RepsitoryContractDeployment/ContractCreationHelperAnimation'
import withOrganisationStore from '@components/withOrganisationStore'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import { useRepositoryRoute } from '@hooks/utils/useRepositoryRoute'
import { Layout } from 'src/client/components/layout/core/Layout'
import { OrganisationAuthLayout } from 'src/client/components/organisation/OrganisationAuthLayout'

const Page = () => {
  const { all: organisations } = useQueryOrganisationFindAll()
  const { repositoryName, organisationName, deploymentName } = useRepositoryRoute()
  return (
    <OrganisationAuthLayout>
      <Layout hasFooter={false}>
        <Layout.Header
          internalRoutes={[
            { current: organisationName, href: `/${organisationName}`, organisations },
            { current: repositoryName, href: `/${organisationName}/${repositoryName}` },
            { current: deploymentName, href: `/${organisationName}/${repositoryName}/deployments/${deploymentName}` },
          ]}
        />
        <Layout.Body border={'lower'}>
          <ContractCreationHelperAnimation className='py-16' />
          <ContractCreationFormDisplay className='h-[calc(100vh-17.75rem)] py-8' />
        </Layout.Body>
      </Layout>
    </OrganisationAuthLayout>
  )
}

export default withOrganisationStore(Page)
