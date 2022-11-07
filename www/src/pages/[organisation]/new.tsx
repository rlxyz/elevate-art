import { Layout } from '@components/Layout/core/Layout'
import { OrganisationAuthLayout } from '@components/Organisation/OrganisationAuthLayout'
import Upload from '@components/Repository/upload-new-traits/upload'
import { useMutateCreateNewRepository } from '@hooks/mutations/useMutateCreateNewRepository'
import { useQueryOrganisation } from '@hooks/query/useQueryOrganisation'
import { Repository } from '@prisma/client'
import clsx from 'clsx'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { OrganisationNavigationEnum } from 'src/types/enums'

const Page: NextPage = () => {
  const { all: organisations, current: organisation } = useQueryOrganisation()
  const router = useRouter()
  const [repository, setRepository] = useState<null | Repository>(null)
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle')
  const { mutate: createRepository } = useMutateCreateNewRepository({
    setRepository,
  })
  const isLoading = !organisation
  return (
    <OrganisationAuthLayout route={OrganisationNavigationEnum.enum.New}>
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
          <div className='left-0 absolute w-full p-12'>
            {uploadState === 'uploading' ||
              (uploadState === 'done' && (
                <div className='w-full flex items-end justify-between pb-3'>
                  <span className='text-lg font-bold'>Layers</span>
                  <button
                    onClick={() => {
                      router.push(`/${organisation?.name}/${repository?.name}`)
                    }}
                    disabled={uploadState !== 'done'}
                    className='border border-mediumGrey p-2 text-xs bg-black text-white rounded-[5px] disabled:cursor-not-allowed disabled:bg-mediumGrey disabled:text-white'
                  >
                    Continue
                  </button>
                </div>
              ))}
            <Upload
              className='h-[50vh]'
              depth={4}
              onDropCallback={createRepository}
              setUploadState={setUploadState}
              gridSize='lg'
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

export default Page
