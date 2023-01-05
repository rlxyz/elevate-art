import { ContractCreationForm } from '@components/deployments/contractDeployment/ContactCreationForm/ContractCreationForm'
import {
  ContractContext,
  createContractCreationStore,
} from '@components/deployments/contractDeployment/ContactCreationForm/useContractCreationStore'
import { ContractCreationHelperAnimation } from '@components/deployments/contractDeployment/ContractCreationAnimation'

export const ContractCreation = () => {
  return (
    <ContractContext.Provider createStore={() => createContractCreationStore}>
      <ContractCreationHelperAnimation className='py-16' />
      <ContractCreationForm className='h-[calc(100vh-17.75rem)] py-8' />
    </ContractContext.Provider>
  )
}
