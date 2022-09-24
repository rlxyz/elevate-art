import { FolderUpload } from '@components/Collection/CollectionHelpers/FileUpload'
import useOrganisationNavigationStore from '@hooks/useOrganisationNavigationStore'
import { Repository } from '@prisma/client'
import { trpc } from '@utils/trpc'
import Image from 'next/image'
import { NextRouter, useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { OrganisationNavigationEnum } from 'src/types/enums'

const CloneTemplate = () => {
  return (
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
  )
}

const CreateNewRepository = () => {
  const router: NextRouter = useRouter()
  const organisationName = router.query.organisation as string
  const { data: organisation } = trpc.useQuery(['organisation.getOrganisationByName', { name: organisationName }])
  const setCurrentRoute = useOrganisationNavigationStore((state) => state.setCurrentRoute)
  useEffect(() => {
    setCurrentRoute(OrganisationNavigationEnum.enum.New)
  }, [])
  const [repository, setRepository] = useState<Repository | null>(null)
  const [createProjectDisabled, setCreateProjectDisabled] = useState(true)

  const mutate = trpc.useMutation('repository.deleteRepositoryById', {
    onSuccess: () => {
      router.push(`/${organisationName}`)
    },
  })

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
      <div className='absolute left-0 w-full border-t border-mediumGrey bg-white p-12 drop-shadow-2xl space-y-12'>
        {/* <div className='text-4xl font-semibold'>Import layers</div> */}
        <FolderUpload
          setRepository={setRepository}
          onSuccess={() => setCreateProjectDisabled(false)}
          organisationId={organisation.id}
        />
        {/* <div className='py-12 pr-12 absolute bottom-0 right-0'>
          <div className='flex justify-end space-x-3'>
            <Button
              variant='secondary'
              onClick={() => {
                if (repository) {
                  // should delete repo if created.
                  mutate.mutate({ repositoryId: repository.id })
                } else {
                  router.push(`/${organisationName}`)
                }
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => router.push(`/${organisationName}/${repository?.name}/preview`)} // todo: should go to collection creation page
              disabled={repository === null && createProjectDisabled}
            >
              Create Project
            </Button>
          </div>
        </div> */}
      </div>
      {/* <div className='col-span-2'>{<CloneTemplate />}</div> */}
      {/* <div className='z-[-1] mt-32 bg-lightGray absolute left-0 w-full h-full py-12' /> */}
    </div>
  )
}

export default CreateNewRepository
