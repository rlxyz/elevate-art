import Button from '@components/UI/Button'
import { Link } from '@components/UI/Link'
import { CubeIcon, DocumentDuplicateIcon, UserIcon } from '@heroicons/react/outline'
import { trpc } from '@utils/trpc'
import clsx from 'clsx'
import Image from 'next/image'
import { NextRouter, useRouter } from 'next/router'
import { useState } from 'react'
import { timeAgo } from '../../utils/time'

const ViewAllRepositories = () => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
  const [query, setQuery] = useState('')
  const { data: collections } = trpc.useQuery([
    'collection.getCollectionByRepositoryNameAndOrganisationName',
    { organisationName, repositoryName },
  ])
  console.log(collections)
  if (!collections) return <></>
  const filteredCollections =
    query === ''
      ? collections
      : collections.filter((collection) => {
          return collection.name.toLowerCase().includes(query.toLowerCase())
        })
  return (
    <>
      <div className='grid grid-cols-10 space-x-3 items-center'>
        <div className='col-span-9 h-full w-full'>
          <input
            placeholder='Search...'
            onChange={(e) => setQuery(e.target.value)}
            className='border h-full w-full border-mediumGrey rounded-[5px] flex items-center pl-4 text-darkGrey'
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
            Add New...
          </Button>
        </div>
      </div>
      <div className='grid grid-cols-3 gap-x-6 gap-y-6'>
        {filteredCollections.map((collection, index) => {
          return (
            <div className='col-span-1 w-full' key={index}>
              <Link href={`/${organisationName}/${collection.name}`} external>
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
                      <span className='text-sm font-semibold'>{collection.name}</span>
                      <span className='text-xs text-darkGrey'>Last Edited {timeAgo(collection.updatedAt)}</span>
                    </div>
                  </div>
                  <div className='flow-root'>
                    <ul role='list'>
                      {[
                        {
                          id: 1,
                          content: 'Generation',
                          target: collection.generations,
                          icon: UserIcon,
                        },
                        {
                          id: 2,
                          content: 'Total Supply',
                          target: collection.totalSupply,
                          icon: CubeIcon,
                        },
                        {
                          id: 3,
                          content: 'tbd',
                          target: 0,
                          icon: DocumentDuplicateIcon,
                        },
                      ].map((event, eventIdx) => (
                        <li key={event.id}>
                          <div className={clsx('relative ml-2', eventIdx !== 2 && 'pb-6')}>
                            {eventIdx !== 2 ? (
                              <span
                                className='absolute top-6 left-1.5 -ml-px h-1/2 w-[1px] bg-black'
                                aria-hidden='true'
                              />
                            ) : null}
                            <div className='relative flex items-center space-x-5'>
                              <div>
                                <span
                                  className={'h-3 w-3 rounded-full flex items-center justify-center ring-8 ring-white'}
                                >
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
                    <div className='text-sm'>{collection._count.collections} collections</div>
                    <div className='text-sm'>{collection._count.layers} layers</div>
                    <div className='text-sm'>
                      {collection.layers.reduce((a, b) => {
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
