import CollectionCreateDialog from '@components/Actions/CollectionCreateDialog'
import Button from '@components/Layout/Button'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/outline'
import { useQueryRepositoryCollection } from '@hooks/query/useQueryRepositoryCollection'
import { useQueryRepositoryLayer } from '@hooks/query/useQueryRepositoryLayer'
import { Collection } from '@prisma/client'
import clsx from 'clsx'
import { Fragment, useEffect, useRef, useState } from 'react'

const Index = () => {
  const [query, setQuery] = useState('')
  const { all: layers, isLoading } = useQueryRepositoryLayer()
  const { all: collections, current: collection, mutate, isLoading: isLoadingCollections } = useQueryRepositoryCollection()
  const [selectedCollection, setSelectedPerson] = useState<undefined | Collection>(collection)
  const [isOpenDialog, setIsOpenDialog] = useState(false)
  const [isOpenListboxOptions, setIsOpenListboxOptions] = useState(false)
  const listBoxRef = useRef()
  const filteredCollections =
    query === ''
      ? collections
      : collections?.filter((collection: Collection) => {
          return collection.name.toLowerCase().includes(query.toLowerCase())
        })

  useEffect(() => {
    setSelectedPerson(collection)
  }, [isLoadingCollections, collection?.name])

  if (!collection || !layers) return null

  return (
    <>
      <Listbox value={selectedCollection} onChange={setSelectedPerson}>
        <Listbox.Button as={Button} onClick={() => setIsOpenListboxOptions(true)} variant='ghost' className='pl-4 pr-3 py-3'>
          <div className='flex justify-between w-full items-center'>
            <div className='flex space-x-2'>
              <img src='/images/branch.svg' className='w-4 h-4' />
              <span className='text-xs font-semibold text-black'>{selectedCollection?.name || ''}</span>
            </div>
            <div>
              <ChevronDownIcon className='w-4 h-4 text-darkGrey' />
            </div>
          </div>
        </Listbox.Button>
        <Transition
          show={isOpenListboxOptions}
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
                      {filteredCollections?.map((collection: Collection) => (
                        <Listbox.Option key={collection.id} value={collection}>
                          <Button
                            className={`cursor-pointer flex flex-row w-full rounded-[5px] justify-between hover:bg-mediumGrey hover:bg-opacity-30`}
                            variant='link'
                            onClick={() => mutate({ collection })}
                          >
                            <div className='flex flex-row justify-between px-1 w-full'>
                              <span
                                className={clsx(
                                  'text-xs text-black',
                                  collection.name === selectedCollection?.name ? 'font-semibold' : 'font-normal'
                                )}
                              >
                                {collection.name}
                              </span>
                              {collection.name === selectedCollection?.name && <CheckIcon className='w-4 h-4 text-black' />}
                            </div>
                          </Button>
                        </Listbox.Option>
                      ))}
                    </div>
                  </div>
                  <div className='pt-2'>
                    <Button
                      variant='primary'
                      className='w-full px-2'
                      size='sm'
                      onClick={(e: any) => {
                        e.preventDefault()
                        setIsOpenListboxOptions(false)
                        setIsOpenDialog(true)
                      }}
                    >
                      <span className='text-xs'>Add New...</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Listbox.Options>
        </Transition>
      </Listbox>
      <CollectionCreateDialog
        onClose={() => {
          setIsOpenDialog(false)
        }}
        isOpen={isOpenDialog}
      />
    </>
  )
}

export default Index
