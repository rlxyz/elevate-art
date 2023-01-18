import { CheckCircleIcon, DocumentAddIcon, DocumentDuplicateIcon, XCircleIcon } from '@heroicons/react/outline'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { FC, PropsWithChildren } from 'react'
import { formatBytes, truncate } from 'src/client/utils/format'
import Card from '../card/Card'
import Tooltip from '../tooltip'

export type TraitElementUploadState = {
  name: string
  imageUrl: string
  size: number
  uploaded: boolean
  type: 'new' | 'existing' | 'invalid' | 'readonly'
}

interface Props {
  layerName?: string
  traits?: TraitElementUploadState[]
  gridSize?: 'md' | 'lg'
  withTooltip?: boolean
}

const defaultProps: Props = {
  gridSize: 'lg',
}

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>
export type UploadDisplayProps = Props & NativeAttrs

const UploadDisplay: FC<PropsWithChildren<UploadDisplayProps>> = ({
  layerName = '',
  traits = [],
  gridSize,
  withTooltip = false,
  ...props
}: React.PropsWithChildren<UploadDisplayProps> & typeof defaultProps) => {
  return (
    <>
      <Card {...props} className='space-y-2'>
        <div className='grid grid-cols-10 '>
          <div className='col-span-9 space-y-3 flex flex-col'>
            <div className='flex space-x-3'>
              <div className='w-full items-start flex flex-col space-y-1'>
                <span className='text-sm font-semibold'>{layerName}</span>
                <span className='text-xs text-darkGrey'>{formatBytes(traits.reduce((a, b) => a + b.size, 0))}</span>
              </div>
            </div>
          </div>
          <div className='col-span-1 h-full flex flex-col items-end justify-center'>
            <span className='text-xs'>
              {traits.filter((file) => file.uploaded).length} / {traits.length}
            </span>
          </div>
        </div>
        <div className='flex items-start rounded-[3px] h-1 bg-lightGray text-left border border-mediumGrey w-full'>
          <motion.div
            style={{ width: `${(traits.filter((x) => x.uploaded).length / traits.length) * 100}%` }}
            className={`bg-blueHighlight h-1 rounded-[3px]`}
          />
        </div>
      </Card>
      <div className={clsx('grid gap-x-3 gap-y-3', gridSize === 'md' && 'grid-cols-6', gridSize == 'lg' && 'grid-cols-12')}>
        {traits
          .sort((a) => (a.type === 'new' ? 1 : a.type === 'existing' ? 0 : a.type === 'invalid' ? -1 : -2))
          .map((item, index) => {
            return (
              <div key={`${item}-${index}`} className='relative flex flex-col space-y-1 items-center'>
                <Image
                  width={200}
                  height={200}
                  src={item.imageUrl}
                  className='rounded-[5px] border border-mediumGrey'
                  alt={item.imageUrl}
                />
                {item.uploaded && <CheckCircleIcon className='absolute rounded-[3px] top-0 right-0 w-3 h-3 text-greenDot m-1' />}
                {withTooltip &&
                  (item.type === 'existing' ? (
                    <Tooltip
                      as={DocumentDuplicateIcon}
                      variant='warning'
                      className='absolute rounded-[3px] left-0 top-0 w-4 h-4 m-1'
                      description={'Duplicate file found. We are reuploading the image.'}
                    />
                  ) : item.type === 'new' ? (
                    <Tooltip
                      as={DocumentAddIcon}
                      variant='highlight'
                      className='absolute rounded-[3px] left-0 top-0 w-4 h-4 m-1'
                      description={'You are uploading a new trait.'}
                    />
                  ) : item.type === 'invalid' ? (
                    <Tooltip
                      as={XCircleIcon}
                      variant='error'
                      className='absolute rounded-[3px] left-0 top-0 w-4 h-4 m-1 overflow-auto'
                      description={'This file cant be upload. Try again...'}
                    />
                  ) : null)}
                {/* <XCircleIcon className='absolute rounded-[3px] top-0 right-0 w-4 h-4 text-redError m-1' /> */}
                <span className='flex w-full items-center justify-center text-[0.6rem] whitespace-nowrap text-ellipsis overflow-hidden'>
                  {truncate(item.name, 'sm')}
                </span>
              </div>
            )
          })}
      </div>
    </>
  )
}

UploadDisplay.displayName = 'UploadDisplay'
UploadDisplay.defaultProps = defaultProps
export default UploadDisplay
