import type { SaleConfig } from '@utils/contracts/ContractData'
import { ethers } from 'ethers'
import { BigNumber } from 'ethers/lib/ethers'
import type { FC } from 'react'
import type { FieldErrorsImpl, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { z } from 'zod'
import type { ContractFormProps } from '.'
import { ContractForm } from './ContractForm'
// import { SaleConfigInput } from './SaleConfigInput'
import { useContractDataFormHook } from './useContractInformationDataForm'

export const SaleConfigEnum = z.nativeEnum(
  Object.freeze({
    CLAIM: 'Claim',
    PRESALE: 'Presale',
    PUBLIC: 'Public',
  })
)

export type SaleConfigType = z.infer<typeof SaleConfigEnum>

export const MintDetailsForm: FC<ContractFormProps> = ({ title, description, next, previous }) => {
  const { register, handleSubmit, errors, setValue, handleClick, saleConfig, setSaleConfig, currentSegment, contractInformationData } =
    useContractDataFormHook<{
      saleConfigs: SaleConfig[]
    }>({
      defaultValues: {
        saleConfigs: [
          {
            startTimestamp: new Date(),
            mintPrice: BigNumber.from(0),
            maxMintPerAddress: BigNumber.from(0),
          },
          {
            startTimestamp: new Date(),
            mintPrice: BigNumber.from(0),
            maxMintPerAddress: BigNumber.from(0),
          },
          {
            startTimestamp: new Date(),
            mintPrice: BigNumber.from(0),
            maxMintPerAddress: BigNumber.from(0),
          },
        ],
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
            return <SaleConfigInput key={index} index={index} title={title} register={register} errors={errors} setValue={setValue} />
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
              try {
                if (isNaN(Number(e.target.value))) {
                  e.target.value = ''
                  return
                }
                if (e.target.value) {
                  // const value = e.target.value.split('.')
                  // const decimal = value[1] ? value[1].slice(0, 18) : '0'
                  // const price = BigNumber.from(`${value[0]}${decimal.padEnd(17, '0')}`)
                  setValue(`saleConfigs.${index}.mintPrice`, BigNumber.from(ethers.utils.parseEther(e.target.value)))
                }
              } catch (err) {
                console.log(err)
                e.target.value = ''
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
        {...register(`saleConfigs.${index}.maxMintPerAddress`, {
          required: true,
          max: 40,
          min: 1,
          onChange: (e) => {
            if (e.target.value) {
              const maxAllocationPerAddress = Number(e.target.value)
              setValue(`saleConfigs.${index}.maxMintPerAddress`, BigNumber.from(maxAllocationPerAddress))
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
