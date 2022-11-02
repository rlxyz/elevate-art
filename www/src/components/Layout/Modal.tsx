import { Dialog, Transition } from '@headlessui/react'
import clsx from 'clsx'
import { Fragment, useEffect, useState } from 'react'
import Loading from './Loading'

interface Props {
  title: string
  description: string
  data: { label: string; value: string }[]
  isLoading: boolean
  onClose?: () => void
  visible?: boolean
}

const defaultProps: Props = {
  title: '',
  description: '',
  data: [],
  isLoading: false,
}

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>
export type ModalProps = Props & NativeAttrs

const ModalComponent: React.FC<React.PropsWithChildren<ModalProps>> = ({
  visible: customVisible,
  onClose,
  description,
  title,
  data,
  isLoading,
  children,
  onClick,
  ...props
}: ModalProps & typeof defaultProps) => {
  const [visible, setVisible] = useState(false)

  const closeModal = () => {
    onClose && onClose()
    setVisible(false)
  }

  useEffect(() => {
    if (typeof customVisible === 'undefined') return
    setVisible(customVisible)
  }, [customVisible])

  return (
    <Transition appear show={visible} as={Fragment} {...props}>
      <Dialog as='div' className='relative z-10' onClose={closeModal}>
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
              <Dialog.Panel className='relative rounded-[5px] bg-white border border-mediumGrey text-left overflow-hidden shadow-xl transform transition-all sm:max-w-md sm:w-full'>
                <Dialog.Title
                  as='h3'
                  className='p-6 border-b border-mediumGrey bg-white text-black text-md justify-center flex leading-6 font-semibold'
                >
                  {title}
                </Dialog.Title>
                <Dialog.Description>
                  <div className='bg-lightGray space-y-3 p-8 border-b border-mediumGrey'>
                    <span className='text-sm'>{description}</span>
                    {data.map(({ label, value }) => (
                      <div className='space-y-1'>
                        <span className='text-[0.6rem] uppercase'>{label}</span>
                        <div className='w-full bg-white text-xs p-2 border border-mediumGrey rounded-[5px]'>{value}</div>
                      </div>
                    ))}
                    {children}
                  </div>
                  <div className='grid grid-cols-2 bg-white divide-x divide-mediumGrey'>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        closeModal()
                      }}
                      className={clsx('text-xs text-darkGrey hover:bg-lightGray py-6')}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={onClick}
                      disabled={isLoading}
                      className={clsx(
                        'text-xs text-darkGrey hover:bg-lightGray hover:text-blueHighlight py-6',
                        isLoading && 'cursor-not-allowed'
                      )}
                    >
                      {isLoading ? <Loading /> : 'Add'}
                    </button>
                  </div>
                </Dialog.Description>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

ModalComponent.defaultProps = defaultProps
ModalComponent.displayName = 'Modal'
export default ModalComponent
