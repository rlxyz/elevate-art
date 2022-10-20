import { TraitElement } from '@prisma/client'
import clsx from 'clsx'
import { forwardRef, HTMLProps } from 'react'

type ComboboxInputProps = { highlight?: boolean; layerName: string; traitElement: TraitElement | null | undefined }
export const ComboboxInput = forwardRef<HTMLInputElement, ComboboxInputProps & HTMLProps<ComboboxInputProps>>(
  ({ highlight = true, layerName, traitElement, placeholder, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'flex items-center space-x-2 w-full rounded-[5px] border border-border text-xs bg-hue-light pl-3 pr-10',
          highlight && traitElement && 'border-success',
          className
        )}
      >
        {traitElement ? (
          <>
            <div className='flex flex-row items-center space-x-3 py-2'>
              <div className='flex flex-row space-x-2 items-center'>
                <span className={clsx('block truncate text-xs tracking-tight text-accents_5')}>{layerName}</span>
                <span className={clsx('block truncate text-xs text-black')}>{traitElement.name}</span>
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
