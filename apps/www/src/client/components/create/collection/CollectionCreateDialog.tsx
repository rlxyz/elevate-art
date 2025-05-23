import { Dialog, Transition } from '@headlessui/react'
import { useMutateCollectionCreate } from '@hooks/trpc/collection/useMutateCollectionCreate'
import { Fragment } from 'react'
import { useForm } from 'react-hook-form'
import Button from 'src/client/components/layout/Button'
import useRepositoryStore from 'src/client/hooks/store/useRepositoryStore'

const Index = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const { mutate: createCollection } = useMutateCollectionCreate({
    onMutate: onClose,
  })
  const repositoryId = useRepositoryStore((state) => state.repositoryId)

  return (
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
              <Dialog.Panel className='relative bg-white rounded-[5px] border border-lightGray text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full p-8 space-y-6 divide-y divide-lightGray'>
                <div className='space-y-4'>
                  <Dialog.Title as='h3' className='text-xl leading-6 font-semibold'>
                    Create new collection
                  </Dialog.Title>
                  <form
                    onSubmit={handleSubmit((data) => {
                      createCollection({
                        name: data.name,
                        repositoryId,
                        totalSupply: Number(data.totalSupply),
                      })
                    })}
                  >
                    <div className='divide-y divide-mediumGrey space-y-6'>
                      <div>
                        <p className='text-sm'>This will create a new collection, your existing collection will remain the same</p>
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
  )
}

export default Index
