/* This example requires Tailwind CSS v2.0+ */
import FileUpload from '@components/CollectionHelpers/FileUpload'
import { Button } from '@components/UI/Button'
import { Dialog, Transition } from '@headlessui/react'
import { XCircleIcon } from '@heroicons/react/outline'
import Image from 'next/image'
import { NextRouter, useRouter } from 'next/router'
import { Fragment, useRef } from 'react'

export const CollectionUpload = ({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (x: boolean) => void
}) => {
  const cancelButtonRef = useRef(null)
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const repositoryName: string = router.query.repository as string
  return (
    <>
      {open && (
        <div className='fixed top-0 left-0 right-0 bottom-0 w-screen h-screen bg-black z-100 opacity-75' />
      )}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
          </Transition.Child>

          <div className='fixed z-10 inset-0 overflow-y-auto'>
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
                  <div className='space-y-6'>
                    <Dialog.Title as='h3' className='text-xl leading-6 font-semibold'>
                      Upload Traits
                    </Dialog.Title>
                    <div className='h-[150px] border border-dashed border-lightGray rounded-[5px] flex flex-col justify-center items-center'>
                      <FileUpload id={`${organisationName}/${repositoryName}`}>
                        <span className='text-lg text-blueHighlight'>Click to upload</span>
                        <span> or drag and drop</span>
                      </FileUpload>
                      <span className='text-xs text-darkGrey'>
                        Only PNG files supported, max file size 10 MB
                      </span>
                    </div>
                    <div className='h-[300px] max-h-[300px] overflow-y-scroll w-full flex flex-col justify-start space-y-6 divide-y divide-lightGray'>
                      {[
                        {
                          trait: 'Background',
                          size: 10,
                          current: 4,
                          total: 5,
                          progress: 75,
                        },
                        {
                          trait: 'Scenery',
                          size: 13.255,
                          current: 4,
                          total: 13,
                          progress: 60,
                        },
                        {
                          trait: 'Clamps',
                          size: 7.5,
                          current: 1,
                          total: 13,
                          progress: 30,
                        },
                        {
                          trait: 'Accessories',
                          size: 7.5,
                          current: 10,
                          total: 13,
                          progress: 70,
                        },
                        {
                          trait: 'Arms',
                          size: 7.5,
                          current: 6,
                          total: 15,
                          progress: 20,
                        },
                      ].map(({ trait, size, current, total }, index) => {
                        return (
                          <div
                            key={`${trait}-${index}`}
                            className={`grid grid-cols-10 ${index !== 0 ? 'pt-3' : ''}`}
                          >
                            <div className='col-span-9 flex space-y-3 flex flex-col'>
                              <div className='flex space-x-3'>
                                <div className='flex items-center'>
                                  <div className='w-[25px] h-[25px] border border-lightGray flex items-center justify-center bg-darkGrey rounded-[5px]'>
                                    <Image src={'/images/not-found.svg'} width={15} height={15} />
                                  </div>
                                </div>
                                <div className='flex flex-col space-y-1'>
                                  <span className='text-sm font-semibold text-black text-darkGrey'>
                                    {trait}
                                  </span>
                                  <span className='text-xs text-darkGrey'>
                                    {size.toFixed(1)} MB
                                  </span>
                                </div>
                              </div>
                              <div className='w-full rounded-[5px] h-1 bg-lightGray'>
                                <div className={`bg-blueHighlight h-1 w-[50%]`}></div>
                              </div>
                            </div>
                            <div className='col-span-1 flex flex-col'>
                              <div className='grid grid-rows-3 justify-items-end'>
                                <XCircleIcon className='w-5 h-5 row-span-1' />
                                <div />
                                <span className='text-sm'>
                                  {current}/{total}
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <div className='flex w-full pt-6 space-x-4'>
                    <div className='w-1/2'>
                      <Button
                        type='button'
                        // className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm'
                        onClick={() => setOpen(false)}
                      >
                        Upload
                      </Button>
                    </div>
                    <div className='w-1/2 h-12'>
                      <Button
                        type='button'
                        disabled
                        // className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 text font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
                        onClick={() => setOpen(false)}
                        ref={cancelButtonRef}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}
