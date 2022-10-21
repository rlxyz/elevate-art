import { presaleConfig } from "@utils/merkle_roots";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

export interface CheckWalletResult {
  isValid: boolean;
  allocation: number;
}

interface UseWalletCheck {
  checkWallet: () => void;
  result: CheckWalletResult;
}

const notValid = {
  isValid: false,
  allocation: 0,
};

export const useWalletCheck = (address: string): UseWalletCheck => {
  const [validationResult, setValidationResult] =
    useState<CheckWalletResult>(undefined);
  const [addressValid, setAddressValid] = useState<boolean>(false);

  useEffect(() => {
    if (!address) {
      setValidationResult(undefined);
    }
    setAddressValid(ethers.utils.isAddress(address));
  }, [address]);

  const checkWallet = () => {
    if (address in presaleConfig.whitelist) {
      return setValidationResult({
        isValid: true,
        allocation: presaleConfig.whitelist[address],
      });
    }

    if (address.toLowerCase() in presaleConfig.whitelist) {
      return setValidationResult({
        isValid: true,
        allocation: presaleConfig.whitelist[address.toLowerCase()],
      });
    }

    return setValidationResult(notValid);
  };

  return {
    checkWallet: addressValid ? checkWallet : undefined,
    result: validationResult,
  };
};
