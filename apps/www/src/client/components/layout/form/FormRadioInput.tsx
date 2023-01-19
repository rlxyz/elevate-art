import clsx from 'clsx'
import React, { forwardRef } from 'react'

export const FormRadioInput = forwardRef<
  HTMLInputElement,
  React.PropsWithChildren<{ className?: string; label: string; checked?: boolean; value: string }>
>(
  (
    { className = '', label, ...props }: React.PropsWithChildren<{ className?: string; label: string; checked?: boolean; value: string }>,
    ref
  ) => {
    return (
      <>
        <div className={clsx('space-y-1 w-full', className)}>
          <div className='flex items-center space-x-3 py-2'>
            <input
              ref={ref}
              type='radio'
              className={clsx('border border-mediumGrey w-4 h-4 flex items-center text-xs disabled:cursor-not-allowed')}
              {...props}
            />
            <label className='text-xs'>{label}</label>
          </div>
        </div>
      </>
    )
  }
)

FormRadioInput.displayName = 'FormRadioInput'
