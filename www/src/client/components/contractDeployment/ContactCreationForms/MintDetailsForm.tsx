import { useContractCreationStore } from '@hooks/store/useContractCreationStore'
import type { FC } from 'react'
import { useForm } from 'react-hook-form'
import { ContractForm } from '../ContractForm'

export type MintDetailsForm = {
  collectionSize: number // inferred from deployment
  pricePerToken: number
}

export const MintDetailsForm: FC<{ title: string; description: string }> = ({ title, description }) => {
  const {
    currentSegment,
    collectionSize,
    pricePerToken,
    contractName,
    contractSymbol,
    setCollectionSize,
    setPricePerToken,
    setCurrentSegment,
  } = useContractCreationStore()

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<MintDetailsForm>({
    defaultValues: {
      collectionSize: collectionSize,
      pricePerToken: pricePerToken,
    },
  })

  const onSubmit = ({ collectionSize, pricePerToken }: MintDetailsForm) => {
    setCollectionSize(collectionSize)
    setPricePerToken(pricePerToken)
    setCurrentSegment(2)
    console.log('currentSegment:', currentSegment)
  }

  return (
    <>
      <ContractForm>
        <ContractForm.Header title={title} description={description} />
        <ContractForm.Body onSubmit={handleSubmit(onSubmit)}>
          <div>
            <ContractForm.Body.Input
              {...register('collectionSize', {
                required: true,
                onChange: (e) => {
                  setValue('collectionSize', e.target.value)
                },
              })}
              label={'Total Supply'}
              description={'The size of the collection'}
              className='col-span-3'
              error={errors.collectionSize}
              placeholder='100'
            />
            <ContractForm.Body.Input
              {...register('pricePerToken', {
                required: true,
                onChange: (e) => {
                  setValue('pricePerToken', e.target.value)
                },
              })}
              label={'Price (ether)'}
              // defaultValue={0.05}
              description={'The cost of each NFT in the collection'}
              className='col-span-3'
              error={errors.collectionSize}
              placeholder='0.05'
            />
          </div>

          <div>
            <ContractForm.Body.Summary contractName={contractName} contractSymbol={contractSymbol} />
          </div>
        </ContractForm.Body>
      </ContractForm>
    </>
  )
}
