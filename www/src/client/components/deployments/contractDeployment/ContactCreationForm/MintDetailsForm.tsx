import type { SaleConfig } from '@utils/contracts/ContractData'
import type { FC } from 'react'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import { z } from 'zod'
import type { ContractFormProps } from '.'
import { ContractForm } from './ContractForm'
import { useContractDataFormHook } from './useContractInformationDataForm'

export const SaleConfigEnum = z.nativeEnum(
  Object.freeze({
    CLAIM: 'Claim',
    PRESALE: 'Presale',
    PUBLIC: 'Public',
  })
)

export type SaleConfigType = z.infer<typeof SaleConfigEnum>

export type MintDetailsForm = {
  collectionSize: number // inferred from deployment
  presale: boolean
  presalePrice: number
  presaleSupply: number
  presaleMaxMintAmount: number
  presaleMaxTransactionAmount: number
  publicSale: boolean
  publicSalePrice: number
  publicSaleMaxMintAmount: number
  publicSaleMaxTransactionAmount: number
}

export const MintDetailsForm: FC<ContractFormProps> = ({ title, description, next, previous }) => {
  const { register, handleSubmit, errors, handleClick, saleConfig, setSaleConfig, currentSegment, contractInformationData } =
    useContractDataFormHook<{
      saleConfigs: SaleConfig[]
    }>({
      defaultValues: {
        saleConfigs: [],
      },
    })

  return (
    <ContractForm>
      <ContractForm.Header title={title} description={description} />
      <ContractForm.Body
        onSubmit={handleSubmit((data) => {
          // infer that index 0 is claim, 1 is presale, 2 is public
          data.saleConfigs.forEach((saleConfig, index) => {
            //! @todo make this more typesafe and modular
            if (index === 0) {
              setSaleConfig(SaleConfigEnum.enum.CLAIM, saleConfig)
            }

            if (index === 1) {
              setSaleConfig(SaleConfigEnum.enum.PRESALE, saleConfig)
            }

            if (index === 2) {
              setSaleConfig(SaleConfigEnum.enum.PUBLIC, saleConfig)
            }

            if (!next) return
            handleClick(next)
          })
        })}
      >
        <div className='space-y-3'>
          {[
            {
              type: SaleConfigEnum.enum.CLAIM,
              title: 'Claim',
            },
            {
              type: SaleConfigEnum.enum.PRESALE,
              title: 'Presale',
            },
            {
              type: SaleConfigEnum.enum.PUBLIC,
              title: 'Public Sale',
            },
          ].map(({ type, title }, index) => {
            return <SaleConfigInput key={index} index={index} title={title} register={register} errors={errors} />
          })}
        </div>
        <ContractForm.Body.Summary
          next={next}
          previous={previous}
          current={currentSegment}
          saleConfig={saleConfig}
          contractInformationData={contractInformationData}
        />
      </ContractForm.Body>
    </ContractForm>
  )
}

const SaleConfigInput = ({
  title,
  register,
  errors,
  index,
}: {
  title: string
  register: UseFormRegister<{ saleConfigs: SaleConfig[] }>
  index: number
  errors: FieldErrors | undefined
}) => {
  return (
    <ContractForm.Body.ToggleCategory label={title} disabled>
      <div className='flex flex-row gap-3 mb-2'>
        <ContractForm.Body.Input
          {...register(`saleConfigs.${index}.startTimestamp`, {
            required: true,
          })}
          label={''}
          // defaultValue={0.05}
          description={''}
          className='col-span-3'
          error={errors.presaleSupply}
          placeholder='Supply'
        />
        <ContractForm.Body.Input
          {...register(`saleConfigs.${index}.mintPrice`, {
            required: true,
            maxLength: {
              value: 20,
              message: 'Max length is 20',
            },
            minLength: {
              value: 3,
              message: 'Max length is 3',
            },
            pattern: /^[-/a-z0-9 ]+$/gi,
            onChange: (e) => {
              setValue('presalePrice', e.target.value)
            },
          })}
          label={''}
          // defaultValue={0.05}
          description={''}
          className='col-span-3'
          error={errors.presalePrice}
          placeholder='Price'
        />
      </div>
      <ContractForm.Body.ToggleInput
        {...register('presaleMaxMintAmount', {
          required: true,
          onChange: (e) => {
            setValue('presaleMaxMintAmount', e.target.value)
          },
        })}
        label={'Mints per Wallet Maximum'}
        // defaultValue={0.05}
        description={''}
        className='col-span-3'
        error={errors.presaleMaxMintAmount}
        placeholder='Unlimited mints for all wallets'
      />
      <ContractForm.Body.ToggleInput
        {...register('presaleMaxTransactionAmount', {
          required: true,
          onChange: (e) => {
            setValue('presaleMaxTransactionAmount', e.target.value)
          },
        })}
        label={'Transactions per Wallet Maximum'}
        // defaultValue={0.05}
        description={''}
        className='col-span-3'
        error={errors.presaleMaxTransactionAmount}
        placeholder='Unlimited transactions for all wallets'
      />
    </ContractForm.Body.ToggleCategory>
  )
}
