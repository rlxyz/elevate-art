import type { SaleConfig } from '@utils/contracts/ContractData'
import { BigNumber } from 'ethers/lib/ethers'
import type { FC } from 'react'
import { z } from 'zod'
import type { ContractFormProps } from '.'
import { ContractForm } from './ContractForm'
import { SaleConfigInput } from './SaleConfigInput'
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
            maxAllocationPerAddress: BigNumber.from(0),
          },
          {
            startTimestamp: new Date(),
            mintPrice: BigNumber.from(0),
            maxAllocationPerAddress: BigNumber.from(0),
          },
          {
            startTimestamp: new Date(),
            mintPrice: BigNumber.from(0),
            maxAllocationPerAddress: BigNumber.from(0),
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
