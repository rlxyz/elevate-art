import { Header } from '@components/Layout/Header'
import { Layout } from '@components/Layout/Layout'
import XCircleIcon from '@heroicons/react/outline/XCircleIcon'
import useOrganisationNavigationStore from '@hooks/useDashboardNavigation'
import type { NextPage } from 'next'
import Image from 'next/image'
import { NextRouter, useRouter } from 'next/router'
import { useEffect } from 'react'
import { OrganisationNavigationEnum } from 'src/types/enums'

const PageImplementation = ({}) => {
  const setCurrentRoute = useOrganisationNavigationStore((state) => state.setCurrentRoute)
  useEffect(() => {
    setCurrentRoute(OrganisationNavigationEnum.enum.New)
  }, [])
  return (
    <div>
      <div className='py-24'>
        <div className='space-y-6'>
          <span className='text-5xl font-bold'>Lets build something new.</span>
          <p className='text-md'>
            To create a new Project, set the name and add layers, or get started with one of our templates.
          </p>
        </div>
      </div>
      <div className='grid grid-cols-6 gap-x-24'>
        <div className='col-span-4'>
          <div className='w-full h-[60rem] border border-mediumGrey rounded-[5px] bg-white p-12 drop-shadow-2xl space-y-12'>
            <div className='text-4xl font-semibold'>Import layers</div>
            <div className='h-2/5 border border-dashed border-mediumGrey rounded-[5px] flex flex-col justify-center items-center'>
              {/* <FileUpload layers={layers} repositoryId={repositoryId}> */}
              <span className='text-lg text-blueHighlight'>Click to upload</span>
              <span> or drag and drop</span>
              {/* </FileUpload> */}
              <span className='text-xs text-darkGrey'>Only PNG files supported, max file size 10 MB</span>
            </div>
            <div className='h-2/6 overflow-y-scroll w-full flex flex-col justify-start space-y-6 divide-y divide-lightGray no-scrollbar'>
              {[
                {
                  trait: 'Background',
                  size: 10,
                  current: 4,
                  total: 5,
                  progress: 75,
                },
                {
                  trait: 'Scenery',
                  size: 13.255,
                  current: 4,
                  total: 13,
                  progress: 60,
                },
                {
                  trait: 'Clamps',
                  size: 7.5,
                  current: 1,
                  total: 13,
                  progress: 30,
                },
                {
                  trait: 'Accessories',
                  size: 7.5,
                  current: 10,
                  total: 13,
                  progress: 70,
                },
                {
                  trait: 'Arms',
                  size: 7.5,
                  current: 6,
                  total: 15,
                  progress: 20,
                },
              ].map(({ trait, size, current, total }, index) => {
                return (
                  <div key={`${trait}-${index}`} className={`grid grid-cols-10 ${index !== 0 ? 'pt-3' : ''}`}>
                    <div className='col-span-9 space-y-3 flex flex-col'>
                      <div className='flex space-x-3'>
                        <div className='flex items-center'>
                          <div className='w-[25px] h-[25px] border border-lightGray flex items-center justify-center bg-darkGrey rounded-[5px]'>
                            <Image src={'/images/not-found.svg'} width={15} height={15} />
                          </div>
                        </div>
                        <div className='flex flex-col space-y-1'>
                          <span className='text-sm font-semibold text-black text-darkGrey'>{trait}</span>
                          <span className='text-xs text-darkGrey'>{size.toFixed(1)} MB</span>
                        </div>
                      </div>
                      <div className='w-full rounded-[5px] h-1 bg-lightGray'>
                        <div className={`bg-blueHighlight h-1 w-[50%]`}></div>
                      </div>
                    </div>
                    <div className='col-span-1 flex flex-col'>
                      <div className='grid grid-rows-3 justify-items-end'>
                        <XCircleIcon className='w-5 h-5 row-span-1' />
                        <div />
                        <span className='text-sm'>
                          {current}/{total}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className='col-span-2'>
          <div className='w-full h-[60rem] border border-mediumGrey rounded-[5px] bg-lightGray p-12'>
            <div className='text-4xl font-semibold'>Clone template</div>
          </div>
        </div>
        <div className='z-[-1] mt-32 bg-lightGray absolute left-0 w-full h-[calc(100vh-32rem)] py-12' />
      </div>
    </div>
  )
}

const Page: NextPage = () => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  return (
    <>
      <Layout>
        <Layout.Header>
          <Header internalRoutes={[{ current: organisationName, href: `/${organisationName}` }]} />
        </Layout.Header>
        <Layout.Body>
          <PageImplementation />
        </Layout.Body>
      </Layout>
    </>
  )
}

export default Page
