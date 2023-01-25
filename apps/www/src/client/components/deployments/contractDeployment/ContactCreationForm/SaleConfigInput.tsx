import type { SaleConfig } from '@utils/contracts/ContractData'
import { BigNumber } from 'ethers/lib/ethers'
import type { FieldErrorsImpl, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { ContractForm } from './ContractForm'

export const SaleConfigInput = ({
  title,
  register,
  errors,
  index,
  setValue,
}: {
  title: string
  register: UseFormRegister<{ saleConfigs: SaleConfig[] }>
  index: number
  errors:
    | Partial<
        FieldErrorsImpl<{
          [x: string]: any
        }>
      >
    | undefined
  setValue: UseFormSetValue<{
    saleConfigs: SaleConfig[]
  }>
}) => {
  return (
    <ContractForm.Body.ToggleCategory label={title} disabled>
      <div className='flex flex-row gap-3 mb-2'>
        <ContractForm.Body.Calendar
          {...register(`saleConfigs.${index}.startTimestamp`, {
            required: true,
            valueAsDate: true,
            onChange: (e) => {
              if (e.target.value) {
                setValue(`saleConfigs.${index}.startTimestamp`, e.target.value)
              }
            },
          })}
          label={'Start Time'}
          className='col-span-3'
        />
        <ContractForm.Body.Input
          {...register(`saleConfigs.${index}.mintPrice`, {
            required: true,
            valueAsNumber: true,
            onChange: (e) => {
              if (e.target.value) {
                const value = e.target.value.split('.')
                const decimal = value[1] ? value[1].slice(0, 18) : '0'
                const price = BigNumber.from(`${value[0]}${decimal.padEnd(18, '0')}`)
                setValue(`saleConfigs.${index}.mintPrice`, price)
              }
            },
          })}
          label={'Mint Price (in ETH)'}
          className='col-span-3'
          error={errors && errors[`saleConfigs.${index}.mintPrice`]}
          placeholder={`Set ${title} Price`}
        />
      </div>
      <ContractForm.Body.Input
        {...register(`saleConfigs.${index}.maxAllocationPerAddress`, {
          required: true,
          max: 20,
          min: 1,
          onChange: (e) => {
            if (e.target.value) {
              const maxAllocationPerAddress = Number(e.target.value)
              setValue(`saleConfigs.${index}.maxAllocationPerAddress`, BigNumber.from(maxAllocationPerAddress))
            }
          },
        })}
        label={'Mints per Wallet Maximum'}
        description={''}
        className='col-span-3 '
        error={errors && errors[`saleConfigs.${index}.maxAllocationPerAddress`]}
        placeholder='Maximum amount of mints per wallet'
      />
    </ContractForm.Body.ToggleCategory>
  )
}
