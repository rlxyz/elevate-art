import Button from '@components/UI/Button'
import { Link } from '@components/UI/Link'
import { Dialog, Transition } from '@headlessui/react'
import { CubeIcon, DocumentDuplicateIcon, UserIcon } from '@heroicons/react/outline'
import { useNotification } from '@hooks/useNotification'
import { trpc } from '@utils/trpc'
import clsx from 'clsx'
import Image from 'next/image'
import { NextRouter, useRouter } from 'next/router'
import { Fragment, useState } from 'react'
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
  const ctx = trpc.useContext()
  const { notifySuccess } = useNotification()
  const mutation = trpc.useMutation('collection.create', {
    onSuccess: (data, variables) => {
      ctx.setQueryData(
        ['collection.getCollectionByRepositoryNameAndOrganisationName', { organisationName, repositoryName }],
        [...(collections || []), data]
      )
      setIsOpen(false)
      notifySuccess(
        <span>
          <span className='text-blueHighlight'>Successfully</span>
          <span>
            {' '}
            created a <span className='font-semibold'>new collection!</span>
          </span>
        </span>,
        'new collection'
      )
    },
  })
  const [isOpen, setIsOpen] = useState(false)
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
              setIsOpen(true)
            }}
          >
            Add New...
          </Button>
          <Transition appear show={isOpen} as={Fragment}>
            <Dialog as='div' className='relative z-10' onClose={() => setIsOpen(false)}>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0'
                enterTo='opacity-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100'
                leaveTo='opacity-0'
              >
                <div className='fixed inset-0 bg-black bg-opacity-50' />
              </Transition.Child>

              <div className='fixed inset-0 overflow-y-auto'>
                <div className='flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0'>
                  <Transition.Child
                    as={Fragment}
                    enter='ease-out duration-300'
                    enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                    enterTo='opacity-100 translate-y-0 sm:scale-100'
                    leave='ease-in duration-200'
                    leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                    leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                  >
                    <Dialog.Panel className='relative bg-white rounded-[5px] border border-lightGray text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full p-8 space-y-6 divide-y divide-lightGray'>
                      <div className='space-y-4'>
                        <Dialog.Title as='h3' className='text-xl leading-6 font-semibold'>
                          Are you sure?
                        </Dialog.Title>
                        <div>
                          <p className='text-sm'>
                            This will generate a new collection and you will lose the existing collection.
                          </p>
                        </div>
                        <div className='flex justify-between'>
                          <div className='ml-[auto]'>
                            <Button
                              disabled={mutation.isLoading}
                              onClick={() =>
                                mutation.mutate({
                                  name: 'something',
                                  organisationName,
                                  repositoryName,
                                  totalSupply: 1,
                                })
                              }
                            >
                              <span className='flex items-center justify-center space-x-2 px-4 py-4'>
                                <span className='text-xs'>Confirm</span>
                              </span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
        </div>
      </div>
      <div className='grid grid-cols-3 gap-x-6 gap-y-6'>
        {filteredCollections.map((collection, index) => {
          return (
            <div className='col-span-1 w-full' key={index}>
              <Link href={`/${organisationName}/${repositoryName}/${collection.name}/preview`} external>
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
