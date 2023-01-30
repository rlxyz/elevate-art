import { useNetwork, useSwitchNetwork } from 'wagmi'

export const useChangeNetwork = () => {
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()

  const changeNetwork = (chainId: number) => {
    if (!chain) return
    if (chainId !== chain.id) {
      switchNetwork?.(chainId)
    }
  }

  return { changeNetwork }
}
