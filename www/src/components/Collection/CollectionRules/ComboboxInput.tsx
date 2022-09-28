import useRepositoryStore from '@hooks/useRepositoryStore'
import { TraitElement } from '@prisma/client'
import { createCloudinary } from '@utils/cloudinary'
import clsx from 'clsx'
import Image from 'next/image'
import { forwardRef, HTMLProps } from 'react'
import { clientEnv } from 'src/env/schema.mjs'

type ComboboxInputProps = { highlight?: boolean; layerName: string; traitElement: TraitElement | null | undefined }
export const ComboboxInput = forwardRef<HTMLInputElement, ComboboxInputProps & HTMLProps<ComboboxInputProps>>(
  ({ highlight = true, layerName, traitElement, placeholder, ...props }, ref) => {
    const repositoryId = useRepositoryStore((state) => state.repositoryId)
    const cld = createCloudinary()
    return (
      <div
        ref={ref}
        className={clsx(
          'flex items-center space-x-2 w-full rounded-[5px] border border-mediumGrey text-sm bg-hue-light pl-3 pr-10 shadow-sm',
          highlight && traitElement && 'border-blueHighlight'
        )}
      >
        {traitElement ? (
          <>
            <div className='flex flex-row items-center space-x-3 py-2'>
              <Image
                priority
                width={18}
                height={18}
                src={cld
                  .image(`${clientEnv.NEXT_PUBLIC_NODE_ENV}/${repositoryId}/${traitElement.layerElementId}/${traitElement.id}`)
                  .toURL()}
                className='rounded-[3px]'
              />
              <div className='flex flex-row space-x-2 items-center'>
                <span className={clsx('block truncate text-xs tracking-tight text-darkGrey')}>{layerName}</span>
                <span className={clsx('block truncate text-sm text-black')}>{traitElement.name}</span>
              </div>
            </div>
          </>
        ) : (
          <input className='w-full h-full py-2 focus:outline-none' placeholder={placeholder} />
        )}
      </div>
    )
  }
)

ComboboxInput.displayName = 'ComboboxInput'
