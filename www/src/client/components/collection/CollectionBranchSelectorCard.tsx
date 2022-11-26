import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon, PlusIcon } from '@heroicons/react/outline'
import { Collection } from '@prisma/client'
import clsx from 'clsx'
import { Fragment, useEffect, useRef, useState } from 'react'
import Button from 'src/client/components/layout/Button'
import SearchInput from 'src/client/components/layout/search/Search'
import { useQueryRepositoryCollection } from 'src/client/hooks/query/useQueryRepositoryCollection'
import { useQueryRepositoryLayer } from 'src/client/hooks/query/useQueryRepositoryLayer'
import CollectionCreateDialog from './CollectionCreateDialog'

const Index = () => {
  const [query, setQuery] = useState('')
  const { all: layers } = useQueryRepositoryLayer()
  const { all: collections, current: collection, mutate, isLoading: isLoadingCollections } = useQueryRepositoryCollection()
  const [selectedCollection, setSelectedPerson] = useState<undefined | Collection>(collection)
  const [isOpenDialog, setIsOpenDialog] = useState(false)
  const filteredCollections =
    query === ''
      ? collections
      : collections?.filter((collection: Collection) => {
          return collection.name.toLowerCase().includes(query.toLowerCase())
        })
  const [openState, setOpenState] = useState(false)
  const buttonRef = useRef<null | HTMLButtonElement>(null) // useRef<HTMLButtonElement>(null)
  const optionRef = useRef<null | HTMLDivElement>(null) // useRef<HTMLDivElement>(null)
  const handleClickOutside = (event: any) => {
    if (buttonRef.current && !buttonRef.current.contains(event.target) && optionRef.current && !optionRef?.current.contains(event.target)) {
      setOpenState(false)
    } else {
      event.stopPropagation()
    }
  }

  useEffect(() => {
    setSelectedPerson(collection)
  }, [isLoadingCollections, collection?.name])

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  })

  return (
    <>
      <Listbox value={selectedCollection} onChange={setSelectedPerson}>
        <Listbox.Button
          ref={buttonRef}
          onClick={() => setOpenState(true)}
          className={clsx(
            !collection ? 'animate-pulse rounded-[5px] bg-mediumGrey bg-opacity-50 h-full' : 'border border-mediumGrey',
            'w-full h-full relative inline-flex items-center cursor-pointer p-3 rounded-[5px] text-xs font-semibold shadow-xs align-middle whitespace-nowrap leading-10 pl-4 pr-3 py-3 text-black'
          )}
        >
          <div className={clsx(!collection && 'invisible', 'flex justify-between w-full items-center')}>
            <div className='flex space-x-2 items-center justify-start'>
              <div className='rounded-full h-4 w-4 bg-blueHighlight' />
              <span className='text-xs font-semibold text-black'>{selectedCollection?.name || ''}</span>
            </div>
            <div>
              <ChevronDownIcon className='w-4 h-4 text-darkGrey' />
            </div>
          </div>
        </Listbox.Button>
        <div ref={optionRef} className='absolute'>
          <Transition
            show={openState}
            as={Fragment}
            enter='transition ease-out duration-200'
            enterFrom='opacity-0 translate-y-1'
            enterTo='opacity-100 translate-y-0'
            leave='transition ease-in duration-150'
            leaveFrom='opacity-100 translate-y-0'
            leaveTo='opacity-0 translate-y-1'
          >
            <Listbox.Options className='absolute z-10 w-56 py-2'>
              <div className='rounded-[5px] ring-1 ring-mediumGrey shadow-lg max-h-[20rem] overflow-y-scroll no-scrollbar '>
                <div className=' bg-white divide-y divide-mediumGrey'>
                  <div className='p-2 grid grid-cols-10 gap-x-1'>
                    <div className='col-span-8'>
                      <SearchInput
                        isLoading={!collections}
                        onChange={(e) => {
                          setQuery(e.target.value)
                        }}
                      />
                    </div>
                    <div className='col-span-2'>
                      <button
                        className='w-full h-full px-2 border border-mediumGrey rounded-[5px] flex items-center justify-center'
                        onClick={(e: any) => {
                          e.preventDefault()
                          setIsOpenDialog(true)
                          setOpenState(false)
                        }}
                      >
                        <PlusIcon className='w-3 h-3 text-darkGrey' />
                      </button>
                    </div>
                  </div>
                  {/* <span className='text-xs text-darkGrey'>Collections</span> */}
                  <div className='overflow-y-scroll max-h-[16em] no-scrollbar'>
                    {filteredCollections?.map((collection: Collection) => (
                      <Listbox.Option key={collection.id} value={collection}>
                        <Button
                          className={`cursor-pointer flex flex-row w-full justify-between`}
                          variant='link'
                          onClick={() => mutate({ collection })}
                        >
                          <div className='flex flex-row items-center justify-between px-1 w-full'>
                            <span
                              className={clsx(
                                'text-xs text-black',
                                collection.name === selectedCollection?.name ? 'font-semibold' : 'font-normal'
                              )}
                            >
                              {collection.name}
                            </span>
                            <div className='flex items-center'>
                              {collection.name === 'main' && (
                                <span className='inline-flex items-center rounded-full bg-lightGray bg-opacity-40 border border-mediumGrey py-1 px-2 text-xs font-medium text-black mr-1'>
                                  {'master'}
                                </span>
                              )}
                              {collection.name === selectedCollection?.name && <CheckIcon className='w-4 h-4 text-blueHighlight' />}
                            </div>
                          </div>
                        </Button>
                      </Listbox.Option>
                    ))}
                  </div>
                </div>
              </div>
            </Listbox.Options>
          </Transition>
        </div>
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
