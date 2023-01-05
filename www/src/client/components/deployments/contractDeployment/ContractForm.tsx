import { FormRadioInput } from '@components/layout/form/FormRadioInput'
import { FormSelectInput } from '@components/layout/form/FormSelectInput'
import { Switch } from '@headlessui/react'
import clsx from 'clsx'
import Image from 'next/image'
import React, { forwardRef, useState } from 'react'
import type { FieldError } from 'react-hook-form'
import { capitalize } from 'src/client/utils/format'

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
      <div className='w-full grid grid-cols-2 gap-4'>{children}</div>
    </form>
  )
}

const ContractSummary = ({
  contractName, // contract level
  contractSymbol, // contract level
  mintType, // from the db; to be removed because we do this when we run AssetDeployment
  blockchain, // chainId
  artCollection, // assetDeployment
  currentSegment,
  // presale,
  presalePrice, // contract level
  presaleSupply, // contract level
  presaleMaxMintAmount, // contract level
  presaleMaxTransactionAmount, // contract level
  publicSale,
  publicSalePrice, // contract level
  publicSaleMaxMintAmount, // contract level
  publicSaleMaxTransactionAmount, // contract level
  onClick,
}: {
  contractName?: string
  contractSymbol?: string
  onClick?: () => void
  mintType?: string
  blockchain?: string
  artCollection?: string
  currentSegment?: number
  presale?: boolean
  presalePrice?: number
  presaleSupply?: number
  presaleMaxMintAmount?: number
  presaleMaxTransactionAmount?: number
  publicSale?: boolean
  publicSalePrice?: number
  publicSaleMaxMintAmount?: number
  publicSaleMaxTransactionAmount?: number
}) => {
  console.log('currentSegment', currentSegment)

  return (
    <div className='w-full flex flex-col space-y-3'>
      <h1 className='text-xs font-semibold'>Finalise the Details</h1>
      <div className='border border-mediumGrey block text-xs w-full pl-2 rounded-[5px] py-2 '>
        <div className='grid grid-cols-3 gap-2'>
          <p className='font-semibold col-span-1'>Name</p>
          <p className='font-semibold col-span-2'>Token</p>
          <p className='col-span-1  text-darkGrey'>{contractName}</p>
          <p className='col-span-2 text-darkGrey'>{contractSymbol}</p>
          <p className='col-span-1 font-semibold'>Collection</p>
          <p className='font-semibold col-span-1'>Mint Type</p>
          <p className='font-semibold col-span-1'>Blockchain</p>
          <div className='flex flex-row '>
            <Image
              width={3}
              height={3}
              alt='avatar-img'
              className='h-4 w-4 select-none rounded-full mr-1'
              src='/images/avatar-blank.png'
              draggable='false'
            />
            <p className='col-span-1 text-darkGrey'>{`${artCollection}`}</p>
          </div>
          <p className='col-span-1 text-darkGrey'>{capitalize(`${mintType}`)}</p>
          <p className='col-span-1 text-darkGrey'>{capitalize(`${blockchain}`)}</p>
          <p className='font-semibold col-span-1'>Pre-Sale Price</p>
          <p className='font-semibold col-span-1'>Mint Cap</p>
          <p className='font-semibold col-span-1'>Transaction Cap</p>
          <p className='col-span-1 text-darkGrey'>{presalePrice}</p>
          <p className='col-span-1 text-darkGrey'>{presaleMaxMintAmount}</p>
          <p className='col-span-1 text-darkGrey'>{presaleMaxTransactionAmount}</p>
          <p className='font-semibold col-span-1'>Public Sale Price</p>
          <p className='font-semibold col-span-1'>Mint Cap</p>
          <p className='font-semibold col-span-1'>Transaction Cap</p>
          <p className='col-span-1 text-darkGrey'>{publicSalePrice}</p>
          <p className='col-span-1 text-darkGrey'>{publicSaleMaxMintAmount}</p>
          <p className='col-span-1 text-darkGrey'>{publicSaleMaxTransactionAmount}</p>
          <p className='font-semibold col-span-2'>Mint Revenue Breakdown</p>
          <p className='font-semibold col-span-1'>Estimated Payout</p>
          <p className='col-span-1 text-darkGrey'>0x1b3...29 (You)</p>
          <p className='col-span-1 text-darkGrey'>95%</p>
          <p className='col-span-1 text-darkGrey '>95 ETH</p>
          <p className='col-span-1 text-darkGrey'>Elevate Art</p>
          <p className='col-span-1 text-darkGrey'>5%</p>
          <p className='col-span-1 text-darkGrey '>5 ETH</p>
          <p className='col-span-1 '>Total Funds Raised</p>
          <p className='col-span-1 '>100%</p>
          <p className='col-span-1 '>100 ETH</p>
        </div>
      </div>

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
