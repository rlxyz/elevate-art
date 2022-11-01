import Loader from '@components/Layout/Loader'
import { Dialog, Transition } from '@headlessui/react'
import { useMutateDeleteTrait } from '@hooks/mutations/useMutateDeleteTrait'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { TraitElement } from '@prisma/client'
import { Fragment } from 'react'

export const RepositoryDeleteTraitDialog = ({
  isOpen,
  onClose,
  traitElements,
}: {
  isOpen: boolean
  onClose: () => void
  traitElements: TraitElement[]
}) => {
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const { mutate, isLoading } = useMutateDeleteTrait()
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={onClose}>
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
                <Dialog.Panel className='relative rounded-[5px] border border-lightGray text-left overflow-hidden shadow-xl transform transition-all sm:max-w-md sm:w-full'>
                  <Dialog.Title
                    as='h3'
                    className='p-8 border-b border-mediumGrey bg-white text-black text-xl justify-center flex leading-6 font-semibold'
                  >
                    Delete Trait
                  </Dialog.Title>
                  <Dialog.Description>
                    <div className='bg-lightGray p-8 border-b border-mediumGrey'>
                      <span className='text-sm'>
                        You are deleting <span className='text-blueHighlight font-bold'>{traitElements.length}</span> traits.
                      </span>
                      <p className='text-xs'>This will be applied to all collections in the project</p>
                    </div>
                    <div className='grid grid-cols-2 bg-white divide-x divide-mediumGrey'>
                      <button onClick={onClose} className='text-xs text-darkGrey hover:bg-lightGray py-6'>
                        Cancel
                      </button>
                      <button
                        disabled={isLoading}
                        onClick={(e) => {
                          e.preventDefault()
                          mutate(
                            {
                              traitElements: traitElements.map(({ id, layerElementId }) => ({
                                id,
                                layerElementId,
                                repositoryId,
                              })),
                            },
                            { onSettled: onClose }
                          )
                        }}
                        className='text-xs text-blueHighlight hover:bg-lightGray py-6'
                      >
                        {isLoading ? <Loader /> : 'Confirm'}
                      </button>
                    </div>
                  </Dialog.Description>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
