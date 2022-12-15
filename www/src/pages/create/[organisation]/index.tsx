import AvatarComponent from '@components/layout/avatar/Avatar'
import AppRoutesNavbar, { ZoneRoutesNavbarPopover } from '@components/layout/header/AppRoutesNavbarProps'
import { PageRoutesNavbar } from '@components/layout/header/PageRoutesNavbar'
import { TriangleIcon } from '@components/layout/icons/RectangleGroup'
import withOrganisationStore from '@components/withOrganisationStore'
import { CubeIcon, GlobeAltIcon } from '@heroicons/react/outline'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import type { NextPage } from 'next'
import { Layout } from 'src/client/components/layout/core/Layout'
import ViewAllRepositories from 'src/client/components/organisation/OrganisationViewAllRepository'
import useOrganisationNavigationStore from 'src/client/hooks/store/useOrganisationNavigationStore'
import { capitalize } from 'src/client/utils/format'
import { env } from 'src/env/client.mjs'
import { DashboardNavigationEnum, OrganisationNavigationEnum, ZoneNavigationEnum } from 'src/shared/enums'
import { OrganisationAuthLayout } from '../../../client/components/organisation/OrganisationAuthLayout'

const Page: NextPage = () => {
  const currentRoute = useOrganisationNavigationStore((state) => state.currentRoute)
  const { all: organisations, current: organisation, isLoading: isLoadingOrganisations } = useQueryOrganisationFindAll()

  return (
    <OrganisationAuthLayout route={OrganisationNavigationEnum.enum.Overview}>
      <Layout>
        {/* <Layout.AppHeader
          internalRoutes={[
            {
              current: organisation?.name || '',
              href: `/${env.NEXT_PUBLIC_CREATE_CLIENT_BASE_PATH}/${organisation?.name}`,
              organisations,
            },
          ]}
        >
          <PageRoutesNavbar>
            {[
              {
                name: OrganisationNavigationEnum.enum.Overview,
                href: `/${env.NEXT_PUBLIC_CREATE_CLIENT_BASE_PATH}/${organisation?.name}`,
                enabled: currentRoute === OrganisationNavigationEnum.enum.Overview,
                loading: isLoadingOrganisations,
              },
              {
                name: OrganisationNavigationEnum.enum.Settings,
                href: `/${env.NEXT_PUBLIC_CREATE_CLIENT_BASE_PATH}/${organisation?.name}/${OrganisationNavigationEnum.enum.Settings}`,
                enabled: currentRoute === OrganisationNavigationEnum.enum.Settings,
                loading: isLoadingOrganisations,
              },
            ].map((item) => (
              <PageRoutesNavbar.Item key={item.name} opts={item} />
            ))}
          </PageRoutesNavbar>
        </Layout.AppHeader> */}
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
            <AppRoutesNavbar.Item label={organisation.name} href='/create'>
              <ZoneRoutesNavbarPopover
                title='Your Teams'
                routes={[
                  {
                    label: capitalize(env.NEXT_PUBLIC_CREATE_CLIENT_BASE_PATH),
                    href: `/${env.NEXT_PUBLIC_CREATE_CLIENT_BASE_PATH}`,
                    selected: false,
                    icon: (props: any) => <AvatarComponent src='/images/avatar-blank.png' />,
                  },
                  {
                    label: OrganisationNavigationEnum.enum.Dashboard,
                    href: `${env.NEXT_PUBLIC_CREATE_CLIENT_BASE_PATH}/${organisation || ''}`,
                    selected: true,
                    icon: (props: any) => <AvatarComponent src='/images/avatar-blank.png' />,
                  },
                ]}
              />
            </AppRoutesNavbar.Item>
          </AppRoutesNavbar>
        </Layout.AppHeader>
        <Layout.PageHeader>
          <PageRoutesNavbar>
            {[
              {
                name: OrganisationNavigationEnum.enum.Overview,
                href: `${OrganisationNavigationEnum.enum.Dashboard}`,
                enabled: true,
                loading: false,
              },
              {
                name: DashboardNavigationEnum.enum.Account,
                href: `/${OrganisationNavigationEnum.enum.Dashboard}/${OrganisationNavigationEnum.enum.Account}`,
                enabled: false,
                loading: false,
              },
            ].map((item) => (
              <PageRoutesNavbar.Item key={item.name} opts={item} />
            ))}
          </PageRoutesNavbar>
        </Layout.PageHeader>
        <Layout.Body>
          <div className='py-8 space-y-8'>
            <ViewAllRepositories />
          </div>
        </Layout.Body>
      </Layout>
    </OrganisationAuthLayout>
  )
}

export default withOrganisationStore(Page)
