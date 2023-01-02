import useContractCreationStore from '@hooks/store/useContractCreationStore'

export const useAnimationMotionValues = () => {
  const { currentSegment, setCurrentSegment, motionValues, setMotionValue } = useContractCreationStore()

  const handleClick = (index: number) => {
    if (currentSegment === index) return null
    setCurrentSegment(index)

    if (index === 0) {
      motionValues['x'][0]?.set(0.5)
      motionValues['x'][1]?.set(0.75)
      motionValues['x'][2]?.set(1)
      motionValues['opacity'][0]?.set(1)
      motionValues['opacity'][1]?.set(0.5)
      motionValues['opacity'][2]?.set(0.25)
    } else if (index === 1) {
      motionValues['x'][0]?.set(0.25)
      motionValues['x'][1]?.set(0.5)
      motionValues['x'][2]?.set(0.75)
      motionValues['opacity'][0]?.set(0.5)
      motionValues['opacity'][1]?.set(1)
      motionValues['opacity'][2]?.set(0.5)
    } else if (index === 2) {
      motionValues['x'][0]?.set(0.0)
      motionValues['x'][1]?.set(0.25)
      motionValues['x'][2]?.set(0.5)
      motionValues['opacity'][0]?.set(0.25)
      motionValues['opacity'][1]?.set(0.5)
      motionValues['opacity'][2]?.set(1)
    }
  }

  return {
    handleClick,
  }
}
