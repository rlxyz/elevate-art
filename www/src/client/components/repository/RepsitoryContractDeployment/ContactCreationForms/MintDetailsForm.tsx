import { useContractCreationStore } from '@hooks/store/useContractCreationStore'
import type { FC } from 'react'
import { useForm } from 'react-hook-form'
import { ContractForm } from '../ContractForm'

export type MintDetailsForm = {
  collectionSize: number // inferred from deployment
  pricePerToken: number
}

export const MintDetailsForm: FC<{ title: string; description: string }> = ({ title, description }) => {
  const { currentSegment, collectionSize, pricePerToken, setCollectionSize, setPricePerToken, setCurrentSegment } =
    useContractCreationStore()

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
  }

  return (
    <>
      <ContractForm>
        <ContractForm.Header title={title} description={description} />
        <ContractForm.Body onSubmit={handleSubmit(onSubmit)}>
          <ContractForm.Body.Input
            {...register('collectionSize', {
              required: true,
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
            })}
            label={'Price (ether)'}
            // defaultValue={0.05}
            description={'The cost of each NFT in the collection'}
            className='col-span-3'
            error={errors.collectionSize}
            placeholder='0.05'
          />
          <input type='submit' value='Continue' />
        </ContractForm.Body>
      </ContractForm>
    </>
  )
}
