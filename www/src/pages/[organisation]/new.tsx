import { FolderUpload } from '@components/Collection/CollectionHelpers/FileUpload'
import { Header } from '@components/Layout/Header'
import { Layout } from '@components/Layout/Layout'
import Button from '@components/UI/Button'
import useOrganisationNavigationStore from '@hooks/useOrganisationNavigationStore'
import { Repository } from '@prisma/client'
import { trpc } from '@utils/trpc'
import type { NextPage } from 'next'
import Image from 'next/image'
import { NextRouter, useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { OrganisationNavigationEnum } from 'src/types/enums'

const PageImplementation = ({}) => {
  const router: NextRouter = useRouter()
  const organisationName = router.query.organisation as string
  const { data: organisation } = trpc.useQuery(['organisation.getOrganisationByName', { name: organisationName }])
  const setCurrentRoute = useOrganisationNavigationStore((state) => state.setCurrentRoute)
  useEffect(() => {
    setCurrentRoute(OrganisationNavigationEnum.enum.New)
  }, [])
  const [repository, setRepository] = useState<Repository | null>(null)
  const [createProjectDisabled, setCreateProjectDisabled] = useState(true)
  if (!organisation) return <div>loading...</div>
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
              <FolderUpload
                setRepository={setRepository}
                onSuccess={() => setCreateProjectDisabled(false)}
                organisationId={organisation.id}
              />
            </div>
            {/* <div className='h-2/6 overflow-y-scroll w-full flex flex-col justify-start space-y-6 divide-y divide-lightGray no-scrollbar'>
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
                          <span className='text-sm font-semibold'>{trait}</span>
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
            </div> */}
            <div className='py-12 pr-12 absolute bottom-0 right-0'>
              <div className='flex justify-end space-x-3'>
                <Button
                  onClick={() => {
                    // should delete repo
                    router.push(`/${organisationName}`)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className='p-4 disabled:bg-disabledGray disabled:cursor-not-allowed disabled:text-white bg-black text-white font-semibold rounded-[5px] items-center flex justify-center'
                  onClick={() => router.push(`/${organisationName}/${repository?.name}/main/preview`)} // todo: should go to collection creation page
                  disabled={repository !== null && createProjectDisabled}
                >
                  Create Project
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className='col-span-2'>
          <div className='w-full h-[60rem] border border-mediumGrey rounded-[5px] bg-lightGray p-12 space-y-12'>
            <div className='text-4xl font-semibold'>Clone template</div>
            <div className='grid grid-cols-1 gap-6'>
              {[
                {
                  imageUrl:
                    'https://vercel.com/_next/image?url=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Fv1647366075%2Ffront%2Fimport%2Fnextjs.png&w=1920&q=75',
                  name: 'RoboGhosts',
                  thumbnailUrl:
                    'https://vercel.com/_next/image?url=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Fv1647366075%2Ffront%2Fimport%2Fnextjs.png&w=1920&q=75',
                },
              ].map(({ imageUrl, thumbnailUrl, name }, index) => {
                return (
                  <div key={index} className='border border-mediumGrey rounded-[5px] h-[15rem]'>
                    <div className='h-3/4 relative'>
                      <Image src={imageUrl} layout='fill' className='rounded-t-[5px]' />
                    </div>
                    <div className='h-1/4 flex items-center space-x-3 p-4'>
                      <div className='border border-mediumGrey w-[35px] h-[35px] rounded-full items-center flex justify-center'>
                        <Image src={thumbnailUrl} width={30} height={30} className='rounded-full' />
                      </div>
                      <span className='font-semibold'>{name}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className='z-[-1] mt-32 bg-lightGray absolute left-0 w-full h-full py-12' />
      </div>
    </div>
  )
}

const Page: NextPage = () => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  return (
    <>
      <Layout hasFooter={false}>
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
