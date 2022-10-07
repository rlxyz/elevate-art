import { OrganisationAuthLayout } from '@components/Layout/AuthLayout'
import { Layout } from '@components/Layout/Layout'
import FolderUpload from '@components/Repository/RepositoryFolderUpload'
import { useQueryOrganisation } from '@hooks/query/useQueryOrganisation'
import useOrganisationNavigationStore from '@hooks/store/useOrganisationNavigationStore'
import type { NextPage } from 'next'
import { useEffect } from 'react'
import { OrganisationNavigationEnum } from 'src/types/enums'
const Page: NextPage = () => {
  const { all: organisations, current: organisation } = useQueryOrganisation()
  const { setCurrentRoute } = useOrganisationNavigationStore((state) => {
    return {
      setCurrentRoute: state.setCurrentRoute,
      currentRoute: state.currentRoute,
    }
  })
  useEffect(() => {
    setCurrentRoute(OrganisationNavigationEnum.enum.New)
  }, [])
  return (
    <OrganisationAuthLayout>
      <Layout hasFooter={false}>
        <Layout.Header
          connectButton
          internalRoutes={[
            {
              current: organisation?.name || '',
              href: `/${organisation?.name}`,
              organisations,
            },
          ]}
        />
        <Layout.Body>
          <FolderUpload />
        </Layout.Body>
      </Layout>
    </OrganisationAuthLayout>
  )
}

export default Page
