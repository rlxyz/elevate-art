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
      <h1 className='font-semibold py-2'>{title}</h1>
      <p className='text-xs max-w-sm text-center'>{description}</p>
    </div>
  )
}

const ContractFormBody = ({ children, onSubmit }: { children: React.ReactElement[]; onSubmit: React.FormEventHandler }) => {
  return (
    <form onSubmit={onSubmit}>
      <div className='w-full grid grid-cols-2 gap-2'>{children}</div>
    </form>
  )
}

const ContractSummary = ({ contractName, contractSymbol }: { contractName: string; contractSymbol: string }) => {
  return (
    <div className='w-full flex flex-col space-y-3'>
      <div className='w-full flex flex-col space-y-3'>
        <h1 className='text-xs font-semibold'>Finalise the Details</h1>
        <div className='border border-mediumGrey block text-xs w-full pl-2 rounded-[5px] py-2'>
          <div className='grid grid-cols-3 gap-2'>
            <p className='font-semibold col-span-1'>Contract Name</p>
            <p className='font-semibold col-span-2'>Symbol</p>
            <p className='col-span-1'>{contractName}</p>
            <p className='col-span-2'>{contractSymbol}</p>
            <p className='col-span-1 font-semibold'>Mint Type</p>
            <p className='font-semibold col-span-2'>Mint Price</p>
            <p className='col-span-1'>Fixed Price</p>
            <p className='col-span-2'>0.1 ETH</p>
            <p className='font-semibold col-span-1'>Mint Limit</p>
            <p className='font-semibold col-span-2'>Mint Fee</p>
            <p className='col-span-1'>100</p>
            <p className='col-span-2'>0.1 ETH</p>
            <p className='col-span-1'>hi </p>
            <p className='col-span-1'>hi </p>
            <p className='col-span-1'>hi </p>
            <p className='col-span-1'>hi </p>
          </div>
        </div>
      </div>

      <div>
        <button className='border p-2 col-span-2 border-mediumGrey rounded-[5px] bg-blueHighlight text-white text-xs disabled:bg-lightGray disabled:cursor-not-allowed disabled:text-darkGrey'>
          Back
        </button>
        <button
          className='border p-2 border-mediumGrey rounded-[5px] bg-blueHighlight text-white text-xs disabled:bg-lightGray disabled:cursor-not-allowed disabled:text-darkGrey'
          type='submit'
        >
          Continue
        </button>
      </div>
    </div>
  )
}

const ContractFormBodyInput = forwardRef<
  HTMLInputElement,
  React.PropsWithChildren<{
    className: string
    label: string
    description: string
    placeholder: string
    error: FieldError
    maxLength: number | undefined
  }>
>(
  ({
    className,
    label,
    description,
    error,
    placeholder,
    maxLength,
    ...props
  }: React.PropsWithChildren<{
    className: string
    label: string
    description: string
    placeholder: string
    error: FieldError | undefined
    maxLength?: number | undefined
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
                : error.type === 'minLength'
                ? 'Must be more than 3 characters long'
                : error.type === 'maxLength'
                ? `Must be less than ${maxLength} characters long`
                : 'Must be between 3 and 20 characters long'}
            </span>
          )}
        </div>
      </>
    )
  }
)

const ContractFormBodyRadioInput = forwardRef<
  HTMLInputElement,
  React.PropsWithChildren<{ className: string; label: string; disabled: boolean }>
>(({ className, label, ...props }: React.PropsWithChildren<{ className: string; label: string }>) => {
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
})

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
ContractFormBody.Summary = ContractSummary
