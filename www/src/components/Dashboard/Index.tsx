import { Link } from '@components/UI/Link'
import { trpc } from '@utils/trpc'
import Image from 'next/image'
import { NextRouter, useRouter } from 'next/router'

const Dashboard = () => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const { data: repositories } = trpc.useQuery([
    'repository.getAllRepositoriesByOrganisationName',
    { name: organisationName },
  ])
  if (!repositories) return <></>
  return (
    <div className='h-full w-full'>
      <div className='h-full grid grid-cols-5'>
        {repositories.map((repository) => {
          return (
            <Link href={`${organisationName}/${repository.name}`} external>
              <div className='w-126 h-44 border border-mediumGrey rounded-[5px] p-6 space-y-4'>
                <div className='flex items-center space-x-3'>
                  <div className='border border-mediumGrey w-[35px] h-[35px] rounded-full'>
                    <Image src='' width={30} height={30} />
                  </div>
                  <span className='text-md font-semibold'>{repository.name}</span>
                </div>
                <div className='space-y-1'>
                  <div className='text-sm'>{repository._count.collections} collections</div>
                  <div className='text-sm'>{repository._count.layers} layers</div>
                  <div className='text-sm'>
                    {repository.layers.reduce((a, b) => {
                      return a + b._count.traitElements
                    }, 0)}{' '}
                    traits
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default Dashboard
