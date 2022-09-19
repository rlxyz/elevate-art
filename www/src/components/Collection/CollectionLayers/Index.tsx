import Button from '@components/UI/Button'
import { Link } from '@components/UI/Link'
import { Dialog, Transition } from '@headlessui/react'
import useCollectionNavigationStore from '@hooks/useCollectionNavigationStore'
import clsx from 'clsx'
import { NextRouter, useRouter } from 'next/router'
import ordinal from 'ordinal'
import { Fragment, useState } from 'react'
import { CollectionNavigationEnum } from 'src/types/enums'
import { useCurrentLayer } from '../../../hooks/useCurrentLayer'
import { FolderUpload } from '../CollectionHelpers/FileUpload'
import { CollectionViewContentWrapper } from '../CollectionHelpers/ViewContent'
import { RarityDisplay } from '../CollectionRarity/RarityDisplay'
import LayerGrid from './LayerGrid'

const AddNewTrait = () => {
  const { currentLayer } = useCurrentLayer()

  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Button disabled className='px-5' variant='primary' size='sm' onClick={() => setIsOpen(true)}>
        <span className='text-xs'>Add new...</span>
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
                      Upload to <span className='underline text-blueHighlight'>{currentLayer.name}</span> layer
                    </Dialog.Title>
                    <div>
                      <p className='text-sm'>You can upload multiple traits at a time</p>
                    </div>
                    <div className='h-96'>
                      <FolderUpload organisationId='' onSuccess={() => console.log('works')} />
                    </div>
                    <div className='flex justify-between'>
                      <div className='ml-[auto]'>
                        <Button disabled>
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
    </>
  )
}

const LayerLayout = () => {
  const currentViewSection = useCollectionNavigationStore((state) => state.currentViewSection)
  const currentLayerPriority = useCollectionNavigationStore((state) => state.currentLayerPriority)
  const { currentLayer, isLoading, isError, refetch } = useCurrentLayer()
  const { name, traitElements } = currentLayer
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
  return (
    <div className='grid grid-cols-10'>
      <div className='col-span-8 flex flex-col'>
        <div className='col-span-6 font-plus-jakarta-sans space-y-1'>
          <h1 className={clsx('text-2xl font-bold text-black', isLoading && 'animate-pulse')}>{name}</h1>
          <p className={clsx('text-sm text-darkGrey', isLoading && 'animate-pulse')}>
            <span>
              There are {traitElements.length} {name} that make up the{' '}
              <span className='text-blueHighlight border-b'>{`${ordinal(currentLayerPriority + 1)} layer`}</span>
            </span>
          </p>
        </div>
      </div>
      <div className='col-span-2 w-full flex justify-end'>
        <div className='flex w-full justify-end items-center space-x-2'>
          <Link
            href={`/${organisationName}/${repositoryName}/${CollectionNavigationEnum.enum.Layers}/${currentLayer.name}`}
            external
            className={clsx(
              'h-8 w-8 border border-mediumGrey rounded-[5px] flex items-center justify-center',
              currentViewSection === CollectionNavigationEnum.enum.Layers && 'bg-mediumGrey bg-opacity-50'
            )}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.25}
              stroke='currentColor'
              className='w-3 h-3'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z'
              />
            </svg>
          </Link>
          <Link
            href={`/${organisationName}/${repositoryName}/${CollectionNavigationEnum.enum.Rarity}/${currentLayer.name}`}
            external
            className={clsx(
              'h-8 w-8 border border-mediumGrey rounded-[5px] flex items-center justify-center',
              currentViewSection === CollectionNavigationEnum.enum.Rarity && 'bg-mediumGrey bg-opacity-50'
            )}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='w-3 h-3'
            >
              <path strokeLinecap='round' strokeLinejoin='round' d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5' />
            </svg>
          </Link>
          <AddNewTrait />
        </div>
      </div>
    </div>
  )
}

const Index = () => {
  const currentViewSection = useCollectionNavigationStore((state) => state.currentViewSection)
  const { currentLayer } = useCurrentLayer()
  const { name, traitElements } = currentLayer
  return (
    <CollectionViewContentWrapper>
      <LayerLayout />
      {currentViewSection === CollectionNavigationEnum.enum.Layers && (
        <LayerGrid traitElements={traitElements} layerName={name} />
      )}
      {currentViewSection === CollectionNavigationEnum.enum.Rarity && <RarityDisplay />}
    </CollectionViewContentWrapper>
  )
}

export default Index
