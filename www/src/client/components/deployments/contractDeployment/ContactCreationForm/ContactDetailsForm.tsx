import type { ContractInformationData } from '@utils/contracts/ContractData'
import { parseChainId } from '@utils/ethers'
import { BigNumber } from 'ethers'
import type { FC } from 'react'
import { capitalize } from 'src/client/utils/format'
import type { ContractFormProps } from '.'
import { ContractForm } from './ContractForm'
import { useContractDataFormHook } from './useContractInformationDataForm'

export const ContractDetailsForm: FC<ContractFormProps> = ({ title, description, next, previous }) => {
  const { register, handleSubmit, errors, handleClick, currentSegment, setContractInformationData } =
    useContractDataFormHook<ContractInformationData>({
      defaultValues: {
        name: '',
        symbol: '',
        mintType: 'on-chain',
        chainId: 5,
        totalSupply: BigNumber.from(0),
        collectionSize: BigNumber.from(0),
      },
    })

  return (
    <ContractForm>
      <ContractForm.Header title={title} description={description} />
      <ContractForm.Body
        onSubmit={handleSubmit((data) => {
          setContractInformationData(data)
          if (!next) return
          handleClick(next)
        })}
      >
        <div className='w-full '>
          <ContractForm.Body.Input
            {...register('name', {
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
            })}
            label={'Contract Name'}
            description={'Your contract name on websites like Etherscan'}
            className='col-span-4'
            placeholder={"e.g 'Bored Ape Yacht Club'"}
            error={errors.name}
            maxLength={20}
          />

          <ContractForm.Body.Input
            {...register('symbol', {
              required: true,
              maxLength: {
                value: 6,
                message: 'Max length is 6',
              },
              minLength: {
                value: 3,
                message: 'Min length is 3',
              },

              pattern: /^[-/a-z0-9 ]+$/gi,
            })}
            label={'Symbol'}
            description={'The name of the token on Etherscan'}
            className='col-span-2'
            placeholder={"e.g. 'BAYC'"}
            error={errors.symbol}
            maxLength={6}
          />

          <ContractForm.Body.Select
            {...register('chainId', {
              required: true,
            })}
            label={'Chain'}
            description={'Select which blockchain you’re launching your NFT collection on'}
            className='col-span-6'
            defaultValue={5}
          >
            <option value={5}>{capitalize(parseChainId(5))}</option>
            <option value={1}>{capitalize(parseChainId(1))}</option>
          </ContractForm.Body.Select>
        </div>
        <div>
          <ContractForm.Body.Summary next={next} previous={previous} current={currentSegment} />
        </div>
      </ContractForm.Body>
    </ContractForm>
  )
}
