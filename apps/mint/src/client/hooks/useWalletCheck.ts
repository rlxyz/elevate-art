import { presaleConfig } from 'src/client/utils/merkle_roots'

export interface CheckWalletResult {
  isValid: boolean
  allocation: number
}

interface UseWalletCheck {
  // checkWallet: ({ address }: { address: string }) => void
  validateAllowlist: ({ address }: { address: string }) => boolean
  // result: CheckWalletResult
}

const notValid = {
  isValid: false,
  allocation: 0,
}

export const useWalletCheck = (address?: string): UseWalletCheck => {
  // const [validationResult, setValidationResult] = useState<CheckWalletResult>(undefined)
  // const [addressValid, setAddressValid] = useState<boolean>(false)

  // useEffect(() => {
  //   if (!address) {
  //     setValidationResult(undefined)
  //   }
  //   setAddressValid(ethers.utils.isAddress(address))
  // }, [address])

  // const checkWallet = ({ address }: { address: string }) => {
  //   if (address in presaleConfig.whitelist) {
  //     return setValidationResult({
  //       isValid: true,
  //       allocation: presaleConfig.whitelist[address],
  //     })
  //   }

  //   if (address.toLowerCase() in presaleConfig.whitelist) {
  //     return setValidationResult({
  //       isValid: true,
  //       allocation: presaleConfig.whitelist[address.toLowerCase()],
  //     })
  //   }

  //   return setValidationResult(notValid)
  // }

  /** Checks whether user is in allowlist */
  const validateAllowlist = ({ address }: { address: string }): boolean => {
    if (address in presaleConfig.whitelist) {
      return true
    }

    if (address.toLowerCase() in presaleConfig.whitelist) {
      return true
    }

    return false
  }

  return {
    // checkWallet: addressValid ? checkWallet : undefined,
    validateAllowlist: validateAllowlist,
    // result: validationResult,
  }
}
