import { useQueryRepositoryDeployments } from '@hooks/trpc/repositoryDeployment/useQueryRepositoryDeployments'
import type { AssetDeploymentType } from '@prisma/client'
import type { ContractInformationData } from '@utils/contracts/ContractData'
import { parseChainId } from '@utils/ethers'
import { BigNumber } from 'ethers'
import { useSession } from 'next-auth/react'
import type { FC } from 'react'
import { capitalize } from 'src/client/utils/format'
import type { ContractFormProps } from '.'
import { ContractForm } from './ContractForm'
import { createInputStringValidation } from './InputValidation'
import { useContractDataFormHook } from './useContractInformationDataForm'

export const ContractDetailsForm: FC<ContractFormProps> = ({ title, description, next, previous }) => {
  const { current: deployment } = useQueryRepositoryDeployments()
  const { data: session } = useSession()
  const {
    register,
    handleSubmit,
    setValue,
    errors,
    handleClick,
    saleConfig,
    currentSegment,
    contractInformationData,
    setContractInformationData,
  } = useContractDataFormHook<ContractInformationData>({
    defaultValues: {
      name: '',
      symbol: '',
      mintType: deployment?.type as AssetDeploymentType,
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
          if (!deployment) return
          const { name, symbol, chainId } = data
          const { totalSupply, type } = deployment
          setContractInformationData({
            name,
            symbol,
            chainId: Number(chainId),
            owner: session?.user?.address,
            mintType: type as AssetDeploymentType,
            totalSupply: BigNumber.from(totalSupply),
            collectionSize: BigNumber.from(totalSupply),
          } as ContractInformationData)
          saleConfig
          if (!next) return
          handleClick(next)
        })}
      >
        <div className='w-full space-y-3'>
          <ContractForm.Body.Input
            {...register('name', {
              ...createInputStringValidation({
                maxLength: 20,
                minLength: 3,
              }),
              onChange: (e) => {
                setValue('name', e.target.value)
              },
            })}
            label={'Contract Name'}
            description={'Your contract name on websites like Etherscan'}
            className='col-span-4'
            placeholder={"e.g 'Bored Ape Yacht Club'"}
            error={errors.name}
          />

          <ContractForm.Body.Input
            {...register('symbol', {
              ...createInputStringValidation({
                maxLength: 6,
                minLength: 3,
              }),
              onChange: (e) => {
                setValue('symbol', e.target.value)
              },
            })}
            label={'Symbol'}
            description={'The name of the token on Etherscan'}
            className='col-span-2'
            placeholder={"e.g. 'BAYC'"}
            error={errors.symbol}
          />

          <ContractForm.Body.Select
            {...register('chainId')}
            label={'Chain'}
            description={'Select which blockchain you’re launching your NFT collection on'}
            className='col-span-6'
            defaultValue={5}
          >
            <option value={5}>{capitalize(parseChainId(5))}</option>
            <option value={1}>{capitalize(parseChainId(1))}</option>
          </ContractForm.Body.Select>
        </div>
        <ContractForm.Body.Summary
          next={next}
          previous={previous}
          current={currentSegment}
          contractInformationData={contractInformationData}
          saleConfig={saleConfig}
        />
      </ContractForm.Body>
    </ContractForm>
  )
}
