import clsx from 'clsx'
import React, { forwardRef } from 'react'
import type { FieldError } from 'react-hook-form'

export const ContractForm = ({ children }: { children: React.ReactElement[] | React.ReactElement }) => {
  const childrens = React.Children.toArray(children)
  return (
    <div className='w-full flex flex-col space-y-9'>
      {childrens.map((child, index) => (
        <div key={index} className='w-full'>
          {child}
        </div>
      ))}
    </div>
  )
}

const ContractFormHeader = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className='flex flex-col items-center'>
      <h1 className='font-semibold'>{title}</h1>
      <p className='text-xs'>{description}</p>
    </div>
  )
}

const ContractFormBody = ({ children, onSubmit }: { children: React.ReactElement[]; onSubmit: React.FormEventHandler }) => {
  return (
    <form onSubmit={onSubmit}>
      <div className='grid grid-cols-2'>
        <div className='w-full grid grid-cols-6 gap-x-3 gap-y-3'>{children}</div>
        <div className='grid grid-cols-3'>
          <p className='text-xs font-semibold'>Name</p>
          <p className='text-xs font-semibold'>Token</p>
        </div>
      </div>
    </form>
  )
}

const ContractFormBodyInput = forwardRef<
  HTMLInputElement,
  React.PropsWithChildren<{ className: string; label: string; description: string; placeholder: string; error: FieldError | undefined }>
>(
  ({
    className,
    label,
    description,
    error,
    placeholder,
    ...props
  }: React.PropsWithChildren<{
    className: string
    label: string
    description: string
    placeholder: string
    error: FieldError | undefined
  }>) => {
    return (
      <>
        <div className={clsx('space-y-1 w-full', className)}>
          <label className='text-xs font-semibold'>{label}</label>
          <input
            className={clsx('border border-mediumGrey block text-xs w-full pl-2 rounded-[5px] py-2')}
            type='string'
            placeholder={placeholder}
            {...props}
          />
          <p className='text-[0.6rem] text-darkGrey'>{description}</p>
          {error && (
            <span className='text-xs text-redError'>
              {error.type === 'required'
                ? 'This field is required'
                : error.type === 'pattern'
                ? 'We only accept - and / for special characters'
                : error.type === 'validate'
                ? 'A layer with this name already exists'
                : 'Must be between 3 and 20 characters long'}
            </span>
          )}
        </div>
      </>
    )
  }
)

const ContractFormBodyRadioInput = forwardRef<HTMLInputElement, React.PropsWithChildren<{ className: string; label: string }>>(
  ({ className, label, ...props }: React.PropsWithChildren<{ className: string; label: string }>) => {
    return (
      <>
        <div className={clsx('space-y-1 w-full', className)}>
          <div className='flex items-center space-x-3 py-2'>
            <input
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

const ContractFormBodySelectInput = forwardRef<
  HTMLSelectElement,
  React.PropsWithChildren<{ className: string; label: string; description: string }>
>(
  ({
    className,
    label,
    description,
    children,
    ...props
  }: React.PropsWithChildren<{ className: string; label: string; description: string }>) => {
    return (
      <>
        <div className={clsx('space-y-1 w-full', className)}>
          <label className='text-xs font-semibold'>{label}</label>
          <select className={clsx('border border-mediumGrey block text-xs w-full pl-2 rounded-[5px] py-2')} {...props}>
            {children}
          </select>
          <p className='text-[0.6rem] text-darkGrey'>{description}</p>
        </div>
      </>
    )
  }
)

ContractFormBodySelectInput.displayName = 'ContractFormBodySelectInput'
ContractFormBodyInput.displayName = 'ContractFormBodyInput'
ContractFormBodyRadioInput.displayName = 'ContractFormBodyRadioInput'
ContractForm.Header = ContractFormHeader
ContractForm.Body = ContractFormBody
ContractFormBody.Input = ContractFormBodyInput
ContractFormBody.Select = ContractFormBodySelectInput
ContractFormBody.Radio = ContractFormBodyRadioInput
