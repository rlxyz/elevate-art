import { Header } from '@components/Layout/Header'
import { Layout } from '@components/Layout/Layout'
import { Link } from '@components/UI/Link'
import useDashboardNavigationStore from '@hooks/useDashboardNavigation'
import type { NextPage } from 'next'
import { DashboardNavigationEnum } from 'src/types/enums'

const Dashboard: NextPage = () => {
  const currentRoute = useDashboardNavigationStore((state) => state.currentRoute)
  return (
    <>
      <Layout>
        <Layout.Header>
          <Header
            internalRoutes={[{ current: 'sekured', href: `` }]}
            internalNavigation={[
              {
                name: DashboardNavigationEnum.enum.Dashboard,
                href: `/dashboard/`,
                enabled: currentRoute === DashboardNavigationEnum.enum.Dashboard,
              },
              {
                name: DashboardNavigationEnum.enum.Settings,
                href: `/account`,
                enabled: currentRoute === DashboardNavigationEnum.enum.Settings,
              },
              {
                name: DashboardNavigationEnum.enum.Activity,
                href: `/dashboard/activity`,
                enabled: currentRoute === DashboardNavigationEnum.enum.Activity,
              },
            ]}
          />
        </Layout.Header>
        <Layout.Body>
          <div className='space-y-20'>
            <div className='w-full min-h-[calc(100vh-7.5rem)] flex flex-col justify-center items-center'>
              <div className='w-[50%]'>
                <img className='h-full object-cover' src='/images/logo-banner.png' alt='elevate art logo' />
              </div>
              <span className='text-xs uppercase'>
                an&nbsp;
                <Link external={true} href='https://twitter.com/rlxyz_eth'>
                  <span className='font-extrabold line-through'>RLXYZ</span>
                </Link>
                &nbsp;production
              </span>
            </div>
          </div>
        </Layout.Body>
      </Layout>
    </>
  )
}

export default Dashboard
