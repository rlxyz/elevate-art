import Button from '@components/UI/Button'
import { Link } from '@components/UI/Link'
import { Dialog, Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/outline'
import { useDeepCompareEffect } from '@hooks/useDeepCompareEffect'
import { useQueryCollection, useQueryRepository, useQueryRepositoryLayer } from '@hooks/useRepositoryFeatures'
import useRepositoryStore from '@hooks/useRepositoryStore'
import { getTokenRanking, getTraitMappings, runMany } from '@utils/compiler'
import { NextRouter, useRouter } from 'next/router'
import { Fragment, useState } from 'react'
import { useForm } from 'react-hook-form'
import { CollectionNavigationEnum } from 'src/types/enums'
import { useMutateCreateCollection } from '../../../hooks/mutations/useMutateCreateCollection'

const Index = () => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
  const collectionName: string = (router.query.collection as string) || 'main'
  const [query, setQuery] = useState('')
  const { data } = useQueryRepository()
  const { data: layers } = useQueryRepositoryLayer()
  const { data: collection } = useQueryCollection()
  const [selectedCollection, setSelectedPerson] = useState<null | { name: string; id: string }>(null)
  const [isOpen, setIsOpen] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const { mutate, isLoading } = useMutateCreateCollection({
    onMutate: () => setIsOpen(false),
  })
  useDeepCompareEffect(() => {
    if (!data?.collections) return
    setSelectedPerson(data.collections?.find((collection) => collection.name === collectionName) || null)
  }, [data?.collections, collectionName])
  const { setTraitMapping, setTokenRanking } = useRepositoryStore((state) => {
    return {
      setTokenRanking: state.setTokenRanking,
      setTraitMapping: state.setTraitMapping,
    }
  })
  const filteredCollections =
    query === ''
      ? data?.collections
      : data?.collections?.filter((collection) => {
          return collection.name.toLowerCase().includes(query.toLowerCase())
        })
  if (!collection || !layers) return null
  return (
    <Listbox value={selectedCollection} onChange={setSelectedPerson}>
      <Listbox.Button as={Button} variant='ghost' className='pl-4 pr-3 py-3'>
        <div className='flex justify-between w-full items-center'>
          <div className='flex space-x-2'>
            <img src='/images/branch.svg' className='w-4 h-4' />
            <span className='text-xs font-semibold text-black'>{selectedCollection?.name || ''}</span>
          </div>
          <div>
            <ChevronDownIcon className='w-4 h-4' />
          </div>
        </div>
      </Listbox.Button>
      <Transition
        as={Fragment}
        enter='transition ease-out duration-200'
        enterFrom='opacity-0 translate-y-1'
        enterTo='opacity-100 translate-y-0'
        leave='transition ease-in duration-150'
        leaveFrom='opacity-100 translate-y-0'
        leaveTo='opacity-0 translate-y-1'
      >
        <Listbox.Options className='absolute z-10 w-56 py-6'>
          <div className='overflow-hidden rounded-[5px] shadow-lg ring-1 ring-black ring-opacity-5 max-h-[20rem] overflow-y-scroll no-scrollbar'>
            <div className='relative bg-white'>
              <div className='p-2 divide-y divide-mediumGrey space-y-2'>
                <input
                  placeholder='Search...'
                  onChange={(e) => {
                    e.preventDefault(), setQuery(e.target.value)
                  }}
                  className='border h-full w-full border-mediumGrey rounded-[5px] flex items-center pl-4 text-xs py-2 text-darkGrey'
                />
                <div className='space-y-2 pt-1'>
                  <span className='text-xs text-darkGrey'>Collections</span>
                  <div>
                    {filteredCollections?.map(({ id, name }) => (
                      <Listbox.Option key={id} value={name}>
                        <Link
                          hover={true}
                          enabled={name === selectedCollection?.name}
                          href={`/${organisationName}/${repositoryName}/${CollectionNavigationEnum.enum.Preview}?collection=${name}`}
                        >
                          <div
                            className='flex flex-row justify-between px-2 w-full'
                            onClick={() => {
                              const tokens = runMany(layers, collection)
                              const { tokenIdMap, traitMap } = getTraitMappings(tokens)
                              setTraitMapping({
                                tokenIdMap,
                                traitMap,
                              })
                              const rankings = getTokenRanking(tokens, traitMap, collection.totalSupply)
                              setTokenRanking(rankings)
                            }}
                          >
                            <span className='text-xs'>{name}</span>
                            <div>{name === selectedCollection?.name && <CheckIcon className='w-4 h-4' />}</div>
                          </div>
                        </Link>
                      </Listbox.Option>
                    ))}
                  </div>
                </div>
                <div className='pt-2'>
                  {data && data.collections && (
                    <Button
                      disabled={isLoading}
                      variant='primary'
                      className='w-full px-2'
                      size='sm'
                      onClick={(e: any) => {
                        e.preventDefault()
                        setIsOpen(true)
                      }}
                    >
                      <span className='text-xs'>Add New...</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Listbox.Options>
      </Transition>

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
                        mutate({
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
                              {...register('name', { required: true, maxLength: 20, minLength: 3, pattern: /^[-/a-z0-9]+$/gi })}
                            />
                            {errors.name && (
                              <span className='text-xs text-redError'>
                                {errors.name.type === 'required'
                                  ? 'This field is required'
                                  : errors.name.type === 'pattern'
                                  ? 'We only accept - and / for special characters'
                                  : 'Must be between 3 and 20 characters long'}
                              </span>
                            )}
                          </div>
                          <div className='space-y-1 flex flex-col'>
                            <span className='text-xs font-base'>Total Supply</span>
                            <input
                              className='font-plus-jakarta-sans text-sm appearance-none block w-full bg-white text-black border border-mediumGrey rounded-lg py-3 px-4 focus:outline-black focus:bg-white focus:border-gray-500'
                              defaultValue={10000}
                              type='number'
                              {...register('totalSupply', { required: true, min: 1, max: 20000 })}
                            />
                            {errors.totalSupply && <span className='text-xs text-redError'>Must be smaller than 10000</span>}
                          </div>
                          <div className='pt-6 flex justify-between'>
                            <div className='ml-[auto]'>
                              <Button disabled={isLoading}>
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
    </Listbox>
  )
}

export default Index
