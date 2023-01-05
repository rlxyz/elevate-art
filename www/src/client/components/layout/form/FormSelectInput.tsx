import clsx from 'clsx'
import React, { forwardRef } from 'react'

export const FormSelectInput = forwardRef<
  HTMLSelectElement,
  React.PropsWithChildren<{ className: string; label: string; description: string; defaultValue: string }>
>(
  (
    {
      className,
      label,
      description,
      children,
      defaultValue,
      ...props
    }: React.PropsWithChildren<{ className: string; label: string; description: string; defaultValue: string }>,
    ref
  ) => {
    return (
      <div className={clsx('space-y-1 w-full', className)}>
        <label className='text-xs font-semibold'>{label}</label>
        <select
          ref={ref}
          defaultValue={defaultValue}
          className={clsx('border border-mediumGrey block text-xs w-full pl-2 rounded-[5px] py-2')}
          {...props}
        >
          {children}
        </select>
        <span className='text-[0.6rem] text-darkGrey'>{description}</span>
      </div>
    )
  }
)

FormSelectInput.displayName = 'FormSelectInput'
