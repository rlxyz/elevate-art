import AppRoutesNavbar, { ZoneRoutesNavbarPopover } from '@components/layout/header/AppRoutesNavbarProps'
import { TriangleIcon } from '@components/layout/icons/RectangleGroup'
import { OrganisationRoutesNavbarPopover } from '@components/organisation/OrganisationRoutesNavbar'
import withOrganisationStore from '@components/withOrganisationStore'
import { CubeIcon, GlobeAltIcon } from '@heroicons/react/outline'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import { useMutateRepositoryCreate } from '@hooks/trpc/repository/useMutateRepositoryCreate'
import type { Repository } from '@prisma/client'
import clsx from 'clsx'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Layout } from 'src/client/components/layout/core/Layout'
import Upload from 'src/client/components/layout/upload/upload'
import { OrganisationAuthLayout } from 'src/client/components/organisation/OrganisationAuthLayout'
import { capitalize } from 'src/client/utils/format'
import { env } from 'src/env/client.mjs'
import { OrganisationNavigationEnum, ZoneNavigationEnum } from 'src/shared/enums'

const Page: NextPage = () => {
  const { all: organisations, current: organisation } = useQueryOrganisationFindAll()
  const router = useRouter()
  const [repository, setRepository] = useState<null | Repository>(null)
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle')
  const { mutate: createRepository } = useMutateRepositoryCreate({ setRepository })
  const isLoading = !organisation
  return (
    <OrganisationAuthLayout route={OrganisationNavigationEnum.enum.New}>
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
              href={`/${env.NEXT_PUBLIC_CREATE_CLIENT_BASE_PATH}/${organisation?.name}`}
            >
              <OrganisationRoutesNavbarPopover />
            </AppRoutesNavbar.Item>
          </AppRoutesNavbar>
        </Layout.AppHeader>
        <Layout.Body>
          <div className='left-0 absolute w-full p-12'>
            {(uploadState === 'uploading' || uploadState === 'done') && (
              <div className='w-full flex items-end justify-between pb-3'>
                <span className='text-lg font-bold'>Layers</span>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    router.push(`/${organisation?.name}/${repository?.name}`)
                  }}
                  type='button'
                  disabled={uploadState !== 'done'}
                  className='border border-mediumGrey p-2 text-xs bg-black text-white rounded-[5px] disabled:cursor-not-allowed disabled:bg-mediumGrey disabled:text-white'
                >
                  Continue
                </button>
              </div>
            )}
            <Upload
              className='h-[50vh]'
              depth={4}
              onDropCallback={createRepository}
              setUploadState={setUploadState}
              gridSize='lg'
              withTooltip={false}
            >
              <div className='h-[30vh] flex items-center'>
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
            </Upload>
          </div>
        </Layout.Body>
      </Layout>
    </OrganisationAuthLayout>
  )
}

export default withOrganisationStore(Page)
