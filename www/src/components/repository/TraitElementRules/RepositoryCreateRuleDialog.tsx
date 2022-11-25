import LoadingComponent from '@components/layout/loading/Loading'
import { Dialog, Transition } from '@headlessui/react'
import { useMutateRepositoryCreateRule } from '@hooks/mutations/useMutateRepositoryCreateRule'
import { TraitElement } from '@prisma/client'
import { RulesType } from '@utils/compiler'
import { Fragment } from 'react'

export const RepositoryCreateRuleDialog = ({
  isOpen,
  onClose,
  condition,
  onSuccess,
  primaryTrait,
  secondaryTrait,
}: {
  onSuccess: () => void
  isOpen: boolean
  onClose: () => void
  condition: RulesType
  primaryTrait: TraitElement
  secondaryTrait: TraitElement
}) => {
  const { mutate, isLoading } = useMutateRepositoryCreateRule()
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
                    Add Rule
                  </Dialog.Title>
                  <Dialog.Description>
                    <div className='bg-lightGray space-y-3 p-8 border-b border-mediumGrey'>
                      <span className='text-sm'>
                        Add a new rule to the repository. This rule will be applied to all collections in the repository.
                      </span>
                      <div>
                        <div className='space-y-1'>
                          <span className='text-[0.6rem] uppercase'>Trait</span>
                          <div className='w-full bg-white text-xs p-2 border border-mediumGrey rounded-[5px]'>
                            {primaryTrait.name}
                          </div>
                        </div>
                        <div className='space-y-1'>
                          <span className='text-[0.6rem] uppercase'>Condition</span>
                          <div className='w-full bg-white text-xs p-2 border border-mediumGrey rounded-[5px]'>{condition}</div>
                        </div>
                        <div className='space-y-1'>
                          <span className='text-[0.6rem] uppercase'>With</span>
                          <div className='w-full bg-white text-xs p-2 border border-mediumGrey rounded-[5px]'>
                            {secondaryTrait.name}
                          </div>
                        </div>
                      </div>
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
                              condition,
                              primaryTraitElementId: primaryTrait.id,
                              primaryLayerElementId: primaryTrait.layerElementId,
                              secondaryTraitElementId: secondaryTrait.id,
                              secondaryLayerElementId: secondaryTrait.layerElementId,
                            },
                            {
                              onSuccess: () => {
                                onSuccess && onSuccess()
                                onClose()
                              },
                              onError: () => {
                                onClose()
                              },
                            }
                          )
                        }}
                        className='text-xs text-blueHighlight hover:bg-lightGray py-6'
                      >
                        {isLoading ? <LoadingComponent /> : 'Add'}
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
