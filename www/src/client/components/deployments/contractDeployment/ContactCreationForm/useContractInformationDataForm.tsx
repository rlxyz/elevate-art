import useContractCreationStore from '@components/deployments/contractDeployment/ContactCreationForm/useContractCreationStore'
import type { DeepPartial, FieldValues } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { useAnimationMotionValues } from '../ContractCreationAnimation/useAnimationMotionValues'

export const useContractDataFormHook = <T extends FieldValues>({ defaultValues }: { defaultValues: DeepPartial<T> }) => {
  const { currentSegment, contractInformationData, setContractInformationData, saleConfig, setSaleConfig } = useContractCreationStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<T>({ defaultValues: defaultValues, mode: 'onChange', reValidateMode: 'onChange' })

  const { handleClick } = useAnimationMotionValues()

  return {
    register,
    handleSubmit,
    errors,
    handleClick,
    currentSegment,
    contractInformationData,
    setContractInformationData,
    saleConfig,
    setSaleConfig,
  }
}
