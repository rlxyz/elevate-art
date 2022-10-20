import { Link } from '@components/Layout/Link'
import { SearchInput } from '@components/Layout/SearchInput'
import { ChevronRightIcon, CubeIcon, DocumentDuplicateIcon, UserIcon } from '@heroicons/react/outline'
import { useQueryOrganisation } from '@hooks/query/useQueryOrganisation'
import { useQueryOrganisationsRepository } from '@hooks/query/useQueryOrganisationsRepository'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import clsx from 'clsx'
import { NextRouter, useRouter } from 'next/router'
import { useState } from 'react'
import { timeAgo } from '../../utils/time'

const NoRepositoryExistPlaceholder = () => {
  const { current } = useQueryOrganisation()
  return (
    <div className='h-full w-full flex flex-col items-center min-h-[calc(100vh-14rem)] justify-center'>
      <div className='flex flex-col space-y-6'>
        <div className='space-y-3 flex flex-col items-center'>
          <div className='w-[50%]'>
            <img className='h-full object-cover' src='/images/logo-banner.png' alt='elevate art logo' />
          </div>
          <span className='text-md'>
            We created a team for you called <span className='text-success font-bold'>{current?.name}</span>
          </span>
        </div>
        <div className='space-y-3 flex flex-col items-center'>
          <Link external className='px-6 space-x-1' href={`${current?.name}/new`}>
            <div className='border flex items-center justify-center border-border rounded-[5px] p-3 bg-black'>
              <span className='text-sm text-white'>Create a Project</span>
              <ChevronRightIcon className='text-white h-4 w-4' />
            </div>
          </Link>
        </div>
        <div className='space-y-3 flex flex-col items-center'>
          <span className='text-xs'>
            <Link external href='https://docs.elevate.art'>
              <span className='text-success font-semibold'>Learn</span>
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
  const { all: repositories, isLoading: isLoadingRepositories } = useQueryOrganisationsRepository()
  const setRepositoryId = useRepositoryStore((state) => state.setRepositoryId)
  if (repositories && repositories.length === 0) return <NoRepositoryExistPlaceholder />
  const isLoading = !repositories
  const filteredRepositories =
    query === ''
      ? repositories
      : repositories?.filter((repo) => {
          return repo.name.toLowerCase().includes(query.toLowerCase())
        })

  return (
    <>
      <div className='grid grid-cols-10 space-x-3 items-center'>
        <div className='col-span-9 h-full w-full'>
          <SearchInput isLoading={isLoading} setQuery={setQuery} />
        </div>
        <div className='col-span-1 h-full flex items-center'>
          <div className={clsx(isLoading && 'bg-accents_7 bg-opacity-50 animate-pulse rounded-[5px]', 'h-full w-full')}>
            <button
              className={clsx(
                isLoading && 'invisible',
                'w-full border h-full rounded-[5px] text-xs text-white bg-black font-semibold'
              )}
              onClick={(e: any) => {
                e.preventDefault()
                router.push(`${organisationName}/new`)
              }}
            >
              Add New
            </button>
          </div>
        </div>
      </div>
      <div className='grid grid-cols-3 gap-x-6 gap-y-6'>
        {!repositories ? (
          <>
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                className={clsx(isLoading && 'bg-accents_7 bg-opacity-50 animate-pulse rounded-[5px]', 'col-span-1 w-full')}
                key={index}
              >
                <div className={clsx(isLoading && 'invisible', 'rounded-[5px] px-6 py-5 space-y-4')}>
                  <div className='flex items-center space-x-3'>
                    <div className='bg-success h-6 w-6 rounded-full' />
                    <div className='flex flex-col'>
                      <span className='text-sm font-semibold'>{'no_collection'}</span>
                      <span className='text-xs text-accents_5'>Last Edited {'0 days ago'}</span>
                    </div>
                  </div>
                  <div className='flow-root'>
                    <ul role='list'>
                      {[
                        {
                          id: 1,
                          content: 'Collections',
                          target: 0,
                          icon: UserIcon,
                        },
                        {
                          id: 2,
                          content: 'Layers',
                          target: 0,
                          icon: CubeIcon,
                        },
                        {
                          id: 3,
                          content: 'Traits',
                          target: 0,
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
                                <div className='whitespace-nowrap text-right text-xs text-black'>{event.target}</div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <></>
        )}
        {filteredRepositories?.map((repository, index) => {
          return (
            <div className='col-span-1 w-full' key={index} onClick={() => setRepositoryId(repository.id)}>
              <Link href={`/${organisationName}/${repository.name}`} external>
                <div className='border border-border rounded-[5px] px-6 py-5 space-y-4'>
                  <div className='flex items-center space-x-3'>
                    <div className='bg-success h-6 w-6 rounded-full' />
                    <div className='flex flex-col'>
                      <span className='text-sm font-semibold'>{repository.name}</span>
                      <span className='text-xs text-accents_5'>Last Edited {timeAgo(repository.updatedAt)}</span>
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
