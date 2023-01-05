import { ContractPayoutAnalyticsLayout } from '@components/explore/AnalyticsLayout/ContractPayoutAnalyticsLayout'
import { ContractSaleAnalyticsLayout } from '@components/explore/AnalyticsLayout/ContractSaleAnalyticsLayout'
import { FormRadioInput } from '@components/layout/form/FormRadioInput'
import { FormSelectInput } from '@components/layout/form/FormSelectInput'
import { Switch } from '@headlessui/react'
import type { ContractInformationData, PayoutData, SaleConfig } from '@utils/contracts/ContractData'
import clsx from 'clsx'
import { BigNumber } from 'ethers'
import React, { forwardRef, useState } from 'react'
import type { FieldError } from 'react-hook-form'
import { ContractInformationAnalyticsLayout } from '../../explore/AnalyticsLayout/ContractInformationAnalyticsLayout'

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

const ContractSummary = ({
  contractInformationData,
  payoutData,
  claimPeriod,
  presalePeriod,
  publicPeriod,
  currentSegment,
  onClick,
}: {
  onClick?: () => void
  currentSegment: number
  payoutData?: PayoutData
  contractInformationData?: ContractInformationData
  claimPeriod?: SaleConfig
  presalePeriod?: SaleConfig
  publicPeriod?: SaleConfig
}) => {
  const contractInformation: ContractInformationData = contractInformationData || {
    name: '',
    symbol: '',
    owner: '0x' as `0x${string}`,
    mintType: '',
    chainId: 99,
    totalSupply: BigNumber.from(0),
    collectionSize: BigNumber.from(0),
  }

  const payout: PayoutData = payoutData || {
    estimatedPayout: BigNumber.from(0),
    paymentReceiver: '0x' as `0x${string}`,
  }

  return (
    <div className='w-full flex flex-col space-y-3'>
      <h1 className='text-xs font-semibold'>Finalise the Details</h1>
      <ContractInformationAnalyticsLayout contractInformationData={contractInformation} />
      <ContractSaleAnalyticsLayout saleConfig={claimPeriod} title={'Claim Period'} />
      <ContractSaleAnalyticsLayout saleConfig={presalePeriod} title={'Presale Period'} />
      <ContractSaleAnalyticsLayout saleConfig={publicPeriod} title={'Public Sale Period'} />
      <ContractPayoutAnalyticsLayout title={'Payout Details'} payoutData={payout} />

      <div className='grid grid-cols-8'>
        {currentSegment === 1 || currentSegment === 2 ? (
          <>
            <button
              className='col-span-1 border mr-2 p-2 border-black rounded-[5px] bg-white text-black text-xs disabled:bg-lightGray disabled:cursor-not-allowed disabled:text-darkGrey'
              type='button'
              onClick={onClick}
            >
              ᐸ
            </button>
            <button
              className='col-span-7 border p-2 border-mediumGrey rounded-[5px] bg-black text-white text-xs disabled:bg-lightGray disabled:cursor-not-allowed disabled:text-darkGrey'
              type='submit'
              onClick={onClick}
            >
              Continue
            </button>
          </>
        ) : (
          <>
            <button
              className='hidden col-span-1 border mr-2 p-2 border-black rounded-[5px] bg-white text-black text-xs disabled:bg-lightGray disabled:cursor-not-allowed disabled:text-darkGrey'
              type='button'
              onClick={onClick}
            >
              ᐸ
            </button>

            <button
              className='col-span-8 border p-2 border-mediumGrey rounded-[5px] bg-black text-white text-xs disabled:bg-lightGray disabled:cursor-not-allowed disabled:text-darkGrey'
              type='submit'
              onClick={onClick}
            >
              Continue
            </button>
          </>
        )}
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
  className: string
  label: string
  children: React.ReactElement[]
}) => {
  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
  }

  const [enabled, setEnabled] = useState(true)

  return (
    <>
      <div className={clsx('space-y-1 w-full', className)}>
        <div className='flex flex-row justify-between content-center'>
          <label className='text-xs font-semibold'>{label}</label>{' '}
          <Switch
            checked={enabled}
            onChange={setEnabled}
            className={classNames(
              enabled ? 'bg-black' : 'bg-mediumGrey',
              'relative inline-flex h-5 w-8 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-mediumGrey focus:ring-offset-1'
            )}
          >
            <span className='sr-only'>Use setting</span>
            <span
              aria-hidden='true'
              className={classNames(
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
