import { useForm } from 'react-hook-form'
import { ContractForm } from '../ContractForm'

export type MintDetailsForm = {
  collectionSize: number // inferred from deployment
  pricePerToken: number
}

export const MintDetailsForm = () => {
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
        <ContractForm.Header
          title='Mint Details'
          description='These are important terms for your contract that you need to finalise before continuing!'
        />
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
