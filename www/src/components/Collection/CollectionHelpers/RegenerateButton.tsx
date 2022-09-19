import Button from '@components/UI/Button'
import { useNotification } from '@hooks/useNotification'
import useRepositoryStore from '@hooks/useRepositoryStore'
import { trpc } from '@utils/trpc'
import Image from 'next/image'

import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'

export const useMutateGenerationIncrement = ({ onMutate }: { onMutate?: () => void }) => {
  const ctx = trpc.useContext()
  const { notifySuccess } = useNotification()
  return trpc.useMutation('collection.incrementGeneration', {
    // Optimistic Update
    onMutate: async (input) => {
      const backup = ctx.getQueryData(['collection.getCollectionById', { id: input.id }])
      if (!backup) return { backup }
      ctx.setQueryData(['collection.getCollectionById', { id: input.id }], {
        ...backup,
        generation: backup.generations + 1,
      })
      console.log('gen', backup.generations + 1)
      onMutate && onMutate()
      return { backup }
    },
    onError: (err, variables, context) => {
      if (!context?.backup) return
      ctx.setQueryData(['collection.getCollectionById', { id: variables.id }], context.backup)
    },
    onSettled: () => ctx.invalidateQueries(['collection.getCollectionById']),
    onSuccess: (data, variables) => {
      notifySuccess(
        <span>
          <span className='text-blueHighlight'>Successfully</span>
          <span>
            {' '}
            generated a <span className='font-semibold'>new collection!</span>
          </span>
        </span>,
        'elevate'
      )
    },
  })
}

const RegegenerateButton = () => {
  const { collectionId } = useRepositoryStore((state) => {
    return {
      collectionId: state.collectionId,
    }
  })
  const [isOpen, setIsOpen] = useState(false)
  const { mutate, isLoading } = useMutateGenerationIncrement({ onMutate: () => setIsOpen(false) })
  return (
    <>
      <div className='flex items-center border border-mediumGrey rounded-[5px] px-4 py-3'>
        <div className='space-y-4'>
          <span className='font-normal flex flex-col text-xs space-y-3'>
            <div className='flex items-center justify-between'>
              <span className='font-semibold'>Generate</span>
            </div>
            <span className='text-darkGrey'>You can regenerate your collection by clicking this button.</span>
            {/* <Button disabled={mutation.isLoading} onClick={() => mutation.mutate({ id: collectionId })}> */}
            <Button disabled={isLoading} onClick={() => setIsOpen(true)}>
              <span className='flex items-center justify-center space-x-2'>
                <Image priority width={30} height={30} src='/images/logo-white.png' alt='Logo' />
                <span className='text-xs'>elevate.art</span>
              </span>
            </Button>
          </span>
        </div>
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
                        Are you sure?
                      </Dialog.Title>
                      <div>
                        <p className='text-sm'>This will generate a new collection and you will lose the existing collection.</p>
                      </div>
                      <div className='flex justify-between'>
                        <div className='ml-[auto]'>
                          <Button disabled={isLoading} onClick={() => mutate({ id: collectionId })}>
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
      </div>
    </>
  )
}

export default RegegenerateButton
