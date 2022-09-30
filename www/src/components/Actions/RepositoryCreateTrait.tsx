import Button from '@components/Layout/Button'
import { Dialog, Transition } from '@headlessui/react'
import { useQueryRepositoryLayer } from '@hooks/query/useQueryRepositoryLayer'
import { Fragment, useState } from 'react'

export const RepositoryCreateTrait = () => {
  const { current: layer } = useQueryRepositoryLayer()
  const [isOpen, setIsOpen] = useState(false)
  if (!layer) return null
  return (
    <>
      <Button disabled variant='primary' onClick={() => setIsOpen(true)}>
        <span className='text-xs'>Add New...</span>
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
                      Upload to <span className='underline text-blueHighlight'>{layer.name}</span> layer
                    </Dialog.Title>
                    <div>
                      <p className='text-sm'>You can upload multiple traits at a time</p>
                    </div>
                    <div className='h-96'>{/* <FolderUpload organisationId='' onSuccess={() => console.log('works')} /> */}</div>
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
