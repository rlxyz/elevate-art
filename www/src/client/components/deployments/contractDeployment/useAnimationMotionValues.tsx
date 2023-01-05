import useContractCreationStore from '@components/deployments/contractDeployment/useContractCreationStore'
import type { ContractCreationType } from '.'
import { ContractCreationEnum } from '.'

export const useAnimationMotionValues = () => {
  const { motionValues } = useContractCreationStore()

  const handleClick = (segment: ContractCreationType) => {
    switch (segment) {
      case ContractCreationEnum.enum.ContractDetails:
        motionValues['x'][0]?.set(0.5)
        motionValues['x'][1]?.set(0.75)
        motionValues['x'][2]?.set(1)
        motionValues['opacity'][0]?.set(1)
        motionValues['opacity'][1]?.set(0.5)
        motionValues['opacity'][2]?.set(0.25)
        break
      case ContractCreationEnum.enum.MintDetails:
        motionValues['x'][0]?.set(0.25)
        motionValues['x'][1]?.set(0.5)
        motionValues['x'][2]?.set(0.75)
        motionValues['opacity'][0]?.set(0.5)
        motionValues['opacity'][1]?.set(1)
        motionValues['opacity'][2]?.set(0.5)
        break
      case ContractCreationEnum.enum.ContractCompletion:
        motionValues['x'][0]?.set(0.0)
        motionValues['x'][1]?.set(0.25)
        motionValues['x'][2]?.set(0.5)
        motionValues['opacity'][0]?.set(0.25)
        motionValues['opacity'][1]?.set(0.5)
        motionValues['opacity'][2]?.set(1)
        break
      default:
        break
    }
  }

  return {
    handleClick,
  }
}
