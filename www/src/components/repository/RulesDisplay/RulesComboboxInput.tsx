import { TraitElementWithRules } from '@hooks/query/useQueryRepositoryLayer'
import clsx from 'clsx'
import { forwardRef, HTMLProps } from 'react'

type RulesComboboxInputProps = { highlight?: boolean; layerName: string; traitElement: TraitElementWithRules | null | undefined }
export const RulesComboboxInput = forwardRef<HTMLInputElement, RulesComboboxInputProps & HTMLProps<RulesComboboxInputProps>>(
  ({ highlight = true, layerName, traitElement, placeholder, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'flex items-center space-x-2 w-full rounded-[5px] border border-mediumGrey text-xs bg-hue-light pl-3 pr-10',
          highlight && traitElement && 'border-blueHighlight',
          className
        )}
      >
        {traitElement ? (
          <>
            <div className='flex flex-row items-center space-x-3 py-2'>
              <div className='flex flex-row space-x-2 items-center'>
                <span className={clsx('block truncate text-xs tracking-tight text-darkGrey')}>{layerName}</span>
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

RulesComboboxInput.displayName = 'ComboboxInput'
