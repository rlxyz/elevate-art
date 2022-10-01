import Button from '@components/Layout/Button'
import { Link } from '@components/Layout/Link'
import { ChevronRightIcon, CubeIcon, DocumentDuplicateIcon, UserIcon } from '@heroicons/react/outline'
import { trpc } from '@utils/trpc'
import clsx from 'clsx'
import Image from 'next/image'
import { NextRouter, useRouter } from 'next/router'
import { useState } from 'react'
import { timeAgo } from '../../utils/time'

const NoRepositoryExistPlaceholder = ({ organisationName }: { organisationName: string }) => {
  return (
    <div className='h-full w-full flex flex-col items-center min-h-[calc(100vh-14rem)] justify-center'>
      <div className='flex flex-col space-y-6'>
        <div className='space-y-3 flex flex-col items-center'>
          <div className='w-[50%]'>
            <img className='h-full object-cover' src='/images/logo-banner.png' alt='elevate art logo' />
          </div>
          <span className='text-md'>
            We created a team for you called <span className='text-blueHighlight font-bold'>{organisationName}</span>
          </span>
        </div>
        <div className='space-y-3 flex flex-col items-center'>
          <Link external className='px-6 space-x-1' href={`${organisationName}/new`}>
            <div className='border flex items-center justify-center border-mediumGrey rounded-[5px] p-3 bg-black'>
              <span className='text-sm text-white'>Create a Project</span>
              <ChevronRightIcon className='text-white h-4 w-4' />
            </div>
          </Link>
        </div>
        <div className='space-y-3 flex flex-col items-center'>
          <span className='text-xs'>
            <Link external href='https://docs.elevate.art'>
              <span className='text-blueHighlight font-semibold'>Learn</span>
            </Link>{' '}
            about elevate.art
          </span>
        </div>
      </div>
    </div>
  )
}

const ViewAllRepositories = () => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const [query, setQuery] = useState('')
  const { data: repositories } = trpc.useQuery(['repository.getAllRepositoriesByOrganisationName', { name: organisationName }])
  if (!repositories || repositories.length === 0) return <NoRepositoryExistPlaceholder organisationName={organisationName} />

  const filteredRepositories =
    query === ''
      ? repositories
      : repositories.filter((repo) => {
          return repo.name.toLowerCase().includes(query.toLowerCase())
        })
  return (
    <>
      <div className='grid grid-cols-10 space-x-3 items-center'>
        <div className='col-span-9 h-full w-full'>
          <input
            placeholder='Search Projects'
            onChange={(e) => setQuery(e.target.value)}
            className='border h-full text-xs w-full border-mediumGrey rounded-[5px] flex items-center pl-4 text-darkGrey'
          />
        </div>
        <div className='col-span-1 h-full w-full'>
          <Button
            className='w-full'
            onClick={(e: any) => {
              e.preventDefault()
              router.push(`${organisationName}/new`)
            }}
          >
            Add New
          </Button>
        </div>
      </div>
      <div className='grid grid-cols-3 gap-x-6 gap-y-6'>
        {filteredRepositories.map((repository, index) => {
          return (
            <div className='col-span-1 w-full' key={index}>
              <Link href={`/${organisationName}/${repository.name}/preview`} external>
                <div className='border border-mediumGrey rounded-[5px] p-6 space-y-4'>
                  <div className='flex items-center space-x-3'>
                    <div className='relative border border-mediumGrey w-[30px] h-[30px] rounded-full'>
                      <Image
                        src='https://rhapsodylabsxyz.sgp1.cdn.digitaloceanspaces.com/rlxyz_banner_image.svg'
                        layout='fill'
                        className='rounded-full'
                      />
                    </div>
                    <div className='flex flex-col'>
                      <span className='text-sm font-semibold'>{repository.name}</span>
                      <span className='text-xs text-darkGrey'>Last Edited {timeAgo(repository.updatedAt)}</span>
                    </div>
                  </div>
                  <div className='flow-root'>
                    <ul role='list'>
                      {[
                        {
                          id: 1,
                          content: 'Collections',
                          target: repository._count.collections,
                          icon: UserIcon,
                        },
                        {
                          id: 2,
                          content: 'Layers',
                          target: repository._count.layers,
                          icon: CubeIcon,
                        },
                        {
                          id: 3,
                          content: 'Traits',
                          target: repository.layers.reduce((a, b) => {
                            return a + b._count.traitElements
                          }, 0),
                          icon: DocumentDuplicateIcon,
                        },
                      ].map((event, eventIdx) => (
                        <li key={event.id}>
                          <div className={clsx('relative ml-2', eventIdx !== 2 && 'pb-6')}>
                            {eventIdx !== 2 ? (
                              <span className='absolute top-6 left-1.5 -ml-px h-1/2 w-[1px] bg-black' aria-hidden='true' />
                            ) : null}
                            <div className='relative flex items-center space-x-5'>
                              <div>
                                <span className={'h-3 w-3 rounded-full flex items-center justify-center ring-8 ring-white'}>
                                  <event.icon className='h-5 w-5 text-black' aria-hidden='true' />
                                </span>
                              </div>
                              <div className='flex min-w-0 flex-1 justify-between items-center space-x-4'>
                                <p className='text-xs text-black'>{event.content}</p>
                                <div className='whitespace-nowrap text-right text-xs text-black'>
                                  {/* <time dateTime={event.datetime}>{event.date}</time> */}
                                  {event.target}
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* <div className='ml-4 space-y-2'>
                    <div className='text-sm'>{repository._count.collections} collections</div>
                    <div className='text-sm'>{repository._count.layers} layers</div>
                    <div className='text-sm'>
                      {repository.layers.reduce((a, b) => {
                        return a + b._count.traitElements
                      }, 0)}{' '}
                      traits
                    </div>
                  </div> */}
                </div>
              </Link>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default ViewAllRepositories
