import { ContractForm } from './ContractForm'

export const ContractCompletionForm = () => {
  return (
    <>
      <ContractForm>
        <ContractForm.Header
          title='Deploy Contract'
          description='Seems like everything is in check. Click the button below to deploy your contract!'
        />
      </ContractForm>
    </>
  )
}
