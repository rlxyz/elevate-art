import { FormRadioInput } from '@components/layout/form/FormRadioInput'
import { FormSelectInput } from '@components/layout/form/FormSelectInput'
import { Switch } from '@headlessui/react'
import clsx from 'clsx'
import React, { forwardRef, useState } from 'react'
import type { FieldError } from 'react-hook-form'
import { ContractSummary } from './ContractSummary'

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
      <span className='text-xs max-w-sm text-center'>{description}</span>
    </div>
  )
}

const ContractFormBody = ({ children, onSubmit }: { children: React.ReactElement[]; onSubmit: React.FormEventHandler }) => {
  return (
    <form onSubmit={onSubmit}>
      <div className='w-full grid grid-cols-2 gap-9'>{children}</div>
    </form>
  )
}

const ContractFormBodyInput = forwardRef<
  HTMLInputElement,
  React.PropsWithChildren<{
    className: string
    label: string
    description: string
    placeholder: string
    error: FieldError | undefined
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
          <span className='text-[0.6rem] text-darkGrey'>{description}</span>
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

const ContractFormBodyToggleInput = forwardRef<
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
    const [enabled, setEnabled] = useState(false)

    return (
      <>
        <div className={clsx('space-y-1 w-full', className)}>
          <div className='flex flex-row justify-between content-center'>
            <label className='text-xs font-semibold'>{label}</label>{' '}
            <Switch
              checked={enabled}
              onChange={setEnabled}
              className={clsx(
                enabled ? 'bg-black' : 'bg-mediumGrey',
                'relative inline-flex h-5 w-8 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-mediumGrey focus:ring-offset-1'
              )}
            >
              <span className='sr-only'>Use setting</span>
              <span
                aria-hidden='true'
                className={clsx(
                  enabled ? 'translate-x-3' : 'translate-x-0',
                  'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                )}
              />
            </Switch>
          </div>

          <div>
            <input
              className={clsx(` border border-mediumGrey block text-xs w-full pl-2 rounded-[5px] py-2  `)}
              type='string'
              placeholder={placeholder}
              disabled={!enabled}
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
        </div>
      </>
    )
  }
)

const ContractFormBodyToggleCategory = ({
  className,
  label,
  children,
}: {
  className?: string
  label: string
  children: React.ReactElement[]
}) => {
  const [enabled, setEnabled] = useState(true)

  return (
    <>
      <div className={clsx('space-y-1 w-full', className)}>
        <div className='flex flex-row justify-between content-center'>
          <label className='text-xs font-semibold'>{label}</label>{' '}
          <Switch
            checked={enabled}
            onChange={setEnabled}
            className={clsx(
              enabled ? 'bg-black' : 'bg-mediumGrey',
              'relative inline-flex h-5 w-8 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-mediumGrey focus:ring-offset-1'
            )}
          >
            <span className='sr-only'>Use setting</span>
            <span
              aria-hidden='true'
              className={clsx(
                enabled ? 'translate-x-3' : 'translate-x-0',
                'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
              )}
            />
          </Switch>
        </div>
        {enabled && <div className='w-full space-y-2'>{children}</div>}
      </div>
    </>
  )
}

const ContractFormBodyInputWithDetails = forwardRef<
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
    const styles = {
      '::after': {
        content: 'test',
      },
    }

    return (
      <>
        <div className={clsx('space-y-1 w-full', className)}>
          <label className='text-xs font-semibold'>{label}</label>
          <input
            style={styles}
            className={clsx('border border-mediumGrey block text-xs w-full pl-2 rounded-[5px] py-2')}
            type='string'
            placeholder={placeholder}
            {...props}
          />
          <span className='text-[0.6rem] text-darkGrey'>{description}</span>
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

ContractFormBodyInput.displayName = 'ContractFormBodyInput'
ContractFormBodyToggleInput.displayName = 'ContractFormBodyToggleInput'
ContractFormBodyInputWithDetails.displayName = 'ContractFormBodyToggleInputWithDetails'

ContractForm.Header = ContractFormHeader
ContractForm.Body = ContractFormBody
ContractFormBody.Input = ContractFormBodyInput
ContractFormBody.Select = FormSelectInput
ContractFormBody.Radio = FormRadioInput
ContractFormBody.Summary = ContractSummary
ContractFormBody.ToggleInput = ContractFormBodyToggleInput
ContractFormBody.ToggleCategory = ContractFormBodyToggleCategory
ContractFormBody.InputWithDetails = ContractFormBodyInputWithDetails
