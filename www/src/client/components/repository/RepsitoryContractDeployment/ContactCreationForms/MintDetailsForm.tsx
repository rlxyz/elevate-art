import type { FC } from 'react'
import { useForm } from 'react-hook-form'
import { ContractForm } from '../ContractForm'

export type MintDetailsForm = {
  collectionSize: number // inferred from deployment
  pricePerToken: number
}

export const MintDetailsForm: FC<{ title: string; description: string }> = ({ title, description }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MintDetailsForm>({
    defaultValues: {
      collectionSize: 0,
      pricePerToken: 0,
    },
  })

  return (
    <>
      <ContractForm>
        <ContractForm.Header title={title} description={description} />
        <ContractForm.Body>
          <ContractForm.Body.Input
            {...register('collectionSize', {
              required: true,
            })}
            label={'Total Supply'}
            description={'The size of the collection'}
            className='col-span-3'
            error={errors.collectionSize}
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
          />
        </ContractForm.Body>
      </ContractForm>
    </>
  )
}
