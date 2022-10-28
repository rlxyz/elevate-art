import { OrganisationAuthLayout } from '@components/Layout/core/AuthLayout'
import { Layout } from '@components/Layout/core/Layout'
import FolderUpload from '@components/Repository/RepositoryFolderUpload'
import { useQueryOrganisation } from '@hooks/query/useQueryOrganisation'
import useOrganisationNavigationStore from '@hooks/store/useOrganisationNavigationStore'
import clsx from 'clsx'
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

  const isLoading = !organisation
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
          <div className='left-0 absolute min-h-[calc(100vh-7rem)] w-full'>
            <FolderUpload>
              <div className='px-48 h-[40vh] flex items-center'>
                <div className='space-y-6'>
                  <div className={clsx(isLoading && 'animate-pulse bg-mediumGrey rounded-[5px]')}>
                    <span className={clsx(isLoading && 'invisible', 'text-5xl font-bold')}>Lets build something new.</span>
                  </div>
                  <div className={clsx(isLoading && 'animate-pulse bg-mediumGrey rounded-[5px]')}>
                    <p className={clsx(isLoading && 'invisible', 'text-md')}>
                      To create a new Project, set the name and add layers, or get started with one of our templates.
                    </p>
                  </div>
                </div>
              </div>
            </FolderUpload>
          </div>
        </Layout.Body>
      </Layout>
    </OrganisationAuthLayout>
  )
}

export default Page
