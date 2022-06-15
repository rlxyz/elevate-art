import { usePresaleMaxAllocation } from './contractsRead'
import { useNotification } from './useNotification'

export const usePresaleMint = (address: string) => {
  const { notifyError } = useNotification()
  const maxInvocation = usePresaleMaxAllocation(address)

  const handleMint = (invocations: number) => {
    if (invocations > maxInvocation) {
      notifyError({ message: 'Trying to mint too many' })
    }
  }

  return {
    isLoading: true,
    handleMint,
  }
}

export const usePublicMint = () => {
  return {
    isLoading: true,
  }
}
