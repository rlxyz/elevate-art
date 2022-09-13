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
import { useForm } from 'react-hook-form'
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
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()
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
                          Create new collection
                        </Dialog.Title>
                        <form
                          onSubmit={handleSubmit((data) => {
                            mutation.mutate({
                              name: data.name,
                              organisationName,
                              repositoryName,
                              totalSupply: Number(data.totalSupply),
                            })
                          })}
                        >
                          <div className='divide-y divide-mediumGrey space-y-6'>
                            <div>
                              <p className='text-sm'>
                                This will create a new collection, your existing collection will remain the same
                              </p>
                            </div>
                            <div className='pt-6 space-y-2'>
                              <div className='space-y-1 flex flex-col'>
                                <span className='text-xs font-base'>Collection name</span>
                                <input
                                  className='font-plus-jakarta-sans text-sm appearance-none block w-full bg-white text-black border border-mediumGrey rounded-lg py-3 px-4 focus:outline-black focus:bg-white focus:border-gray-500'
                                  defaultValue='development'
                                  type='string'
                                  {...register('name', { required: true, maxLength: 20, minLength: 3 })}
                                />
                                {errors.name && (
                                  <span className='text-xs text-redError'>Must be between 3 and 20 characters long</span>
                                )}
                              </div>
                              <div className='space-y-1 flex flex-col'>
                                <span className='text-xs font-base'>Total Supply</span>
                                <input
                                  className='font-plus-jakarta-sans text-sm appearance-none block w-full bg-white text-black border border-mediumGrey rounded-lg py-3 px-4 focus:outline-black focus:bg-white focus:border-gray-500'
                                  defaultValue={10000}
                                  type='number'
                                  {...register('totalSupply', { required: true, min: 1, max: 10000 })}
                                />
                                {errors.totalSupply && <span className='text-xs text-redError'>Must be smaller than 10000</span>}
                              </div>
                              <div className='pt-6 flex justify-between'>
                                <div className='ml-[auto]'>
                                  <Button>
                                    <span className='flex items-center justify-center space-x-2 px-4 py-4'>
                                      <span className='text-xs'>Confirm</span>
                                    </span>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
        </div>
      </div>
      <div className='no-scrollbar overflow-x-scroll flex flex-row space-x-6 w-full'>
        {filteredCollections.map((collection, index) => {
          return (
            <div className='w-full' key={index}>
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
                      <span className='text-xs text-darkGrey relative w-max'>
                        <span>Last Edited {timeAgo(collection.updatedAt)}</span>
                      </span>
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
                </div>
              </Link>
            </div>
          )
        })}
        {/* <div>
          {filteredCollections.length === 1 && (
            <div
              onClick={(e: any) => {
                e.preventDefault()
                setIsOpen(true)
              }}
              className='w-[20rem] h-full border border-mediumGrey rounded-[5px] flex items-center justify-center text-black text-sm'
            >
              Add new
            </div>
          )}
        </div> */}
      </div>
    </>
  )
}

export default ViewAllRepositories
