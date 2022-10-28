import { Disclosure, Transition } from '@headlessui/react'
import { CheckCircleIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline'
import { formatBytes } from '@utils/format'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { FC, PropsWithChildren } from 'react'

interface Props {
  layerName?: string
  traits?: {
    name: string
    imageUrl: string
    size: number
    uploaded: boolean
  }[]
}

const defaultProps = {}

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>
export type UploadDisplayProps = Props & NativeAttrs

const UploadDisplay: FC<PropsWithChildren<UploadDisplayProps>> = ({
  layerName = '',
  traits = [],
  ...props
}: React.PropsWithChildren<UploadDisplayProps> & typeof defaultProps) => {
  return (
    <Disclosure {...props}>
      {({ open }) => (
        <>
          <Disclosure.Button className={`border border-mediumGrey rounded-[5px] p-2 grid grid-cols-10 w-full`}>
            <div className='col-span-9 space-y-3 flex flex-col'>
              <div className='flex space-x-3'>
                <div className='flex items-center'>
                  <div className='w-[25px] h-[25px] border border-lightGray flex items-center justify-center bg-darkGrey rounded-[5px]'>
                    <Image src={'/images/not-found.svg'} width={15} height={15} />
                  </div>
                </div>
                <div className='w-full items-start flex flex-col space-y-1'>
                  <span className='text-sm font-semibold'>{layerName}</span>
                  <span className='text-xs text-darkGrey'>{formatBytes(traits.reduce((a, b) => a + b.size, 0))}</span>
                </div>
              </div>
              <div className='flex items-start rounded-[5px] h-1 bg-lightGray text-left'>
                <motion.div
                  style={{ width: `${(traits.filter((x) => x.uploaded).length / traits.length) * 100}%` }}
                  className={`bg-blueHighlight h-1`}
                />
              </div>
            </div>
            <div className='col-span-1 flex flex-col'>
              <div className='grid grid-rows-3 justify-items-end'>
                {open ? <ChevronUpIcon className='w-3 h-3 row-span-1' /> : <ChevronDownIcon className='w-3 h-3 row-span-1' />}
                <div />
                <span className='text-sm'>
                  {traits.filter((file) => file.uploaded).length} / {traits.length}
                </span>
              </div>
            </div>
          </Disclosure.Button>
          <Transition
            show={open}
            enter='transition duration-100 ease-out'
            enterFrom='transform scale-95 opacity-0'
            enterTo='transform scale-100 opacity-100'
            leave='transition duration-75 ease-out'
            leaveFrom='transform scale-100 opacity-100'
            leaveTo='transform scale-95 opacity-0'
          >
            <Disclosure.Panel>
              <div className='grid grid-cols-12 gap-x-3 gap-y-3'>
                {traits.map((item, index) => {
                  return (
                    <div key={`${item}-${index}`} className='relative flex flex-col space-y-1 items-center'>
                      <img width={200} height={200} src={item.imageUrl} className='rounded-[5px] border border-mediumGrey' />
                      {item.uploaded && (
                        <CheckCircleIcon className='absolute rounded-[3px] top-0 right-0 w-4 h-4 text-greenDot m-1' />
                      )}
                      {/* <XCircleIcon className='absolute rounded-[3px] top-0 right-0 w-4 h-4 text-redError m-1' /> */}
                      <span className='text-xs overflow-scroll whitespace-nowrap no-scrollbar'>{item.name}</span>
                    </div>
                  )
                })}
              </div>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  )
}

UploadDisplay.displayName = 'UploadDisplay'
UploadDisplay.defaultProps = defaultProps
export default UploadDisplay
