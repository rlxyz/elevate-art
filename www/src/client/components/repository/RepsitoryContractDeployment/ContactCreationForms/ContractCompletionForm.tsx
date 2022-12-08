import type { FC } from 'react'
import { ContractForm } from '../ContractForm'

export const ContractCompletionForm: FC<{ title: string; description: string }> = ({ title, description }) => {
  return (
    <>
      <ContractForm>
        <ContractForm.Header title={title} description={description} />
      </ContractForm>
    </>
  )
}
