import Button from '@components/UI/Button'
import { Link } from '@components/UI/Link'
import { trpc } from '@utils/trpc'
import Image from 'next/image'
import { NextRouter, useRouter } from 'next/router'

const ViewAllRepositories = () => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const { data: repositories } = trpc.useQuery([
    'repository.getAllRepositoriesByOrganisationName',
    { name: organisationName },
  ])
  if (!repositories) return <></>
  return (
    <div className='h-full w-full space-y-6'>
      <div className='w-full grid grid-cols-10 space-x-3 items-center'>
        <div className='col-span-9'>
          <div className='h-12 border border-mediumGrey rounded-[5px] flex items-center pl-4 text-darkGrey'>
            Search...
          </div>
        </div>
        <div className='col-span-1 h-full w-full'>
          <Button
            onClick={(e: any) => {
              e.preventDefault()
              router.push(`${organisationName}/new`)
            }}
          >
            Add New...
          </Button>
        </div>
      </div>
      <div className='h-full grid grid-cols-3 gap-x-6 gap-y-6'>
        {repositories.map((repository, index) => {
          return (
            <div className='col-span-1 w-full shadow-md' key={index}>
              <Link href={`${organisationName}/${repository.name}`} external>
                <div className='h-56 border border-mediumGrey rounded-[5px] p-6 space-y-4'>
                  <div className='flex items-center space-x-3'>
                    <div className='border border-mediumGrey w-[35px] h-[35px] rounded-full'>
                      <Image src='' width={30} height={30} />
                    </div>
                    <span className='text-lg font-semibold'>{repository.name}</span>
                  </div>
                  <div className='ml-4 space-y-2'>
                    <div className='text-md'>{repository._count.collections} collections</div>
                    <div className='text-md'>{repository._count.layers} layers</div>
                    <div className='text-md'>
                      {repository.layers.reduce((a, b) => {
                        return a + b._count.traitElements
                      }, 0)}{' '}
                      traits
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ViewAllRepositories
