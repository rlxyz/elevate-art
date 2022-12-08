import { useForm } from 'react-hook-form'
import { ContractForm } from './ContractForm'
import type { SmartContactDetailsForm } from './SmartContactDetailsForm'

export type MintDetailsForm = {
  collectionSize: number // inferred from deployment
  price: number
}
export const MintDetailsForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SmartContactDetailsForm>({
    defaultValues: {
      contractName: '',
      contractSymbol: '',
      mintType: 'off-chain',
      blockchain: 'goerli',
    },
  })

  return (
    <>
      <ContractForm>
        <ContractForm.Header
          title='Mint Details'
          description='These are important terms for your contract that you need to finalise before continuing!'
        />
        {/* <ContractFormBody></ContractFormBody> */}
      </ContractForm>
    </>
  )
}
