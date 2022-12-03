import { ethers } from "ethers";
import { keccak256 } from "js-sha3";
import { env } from "../env/client.mjs";

export const provider = new ethers.providers.AlchemyProvider("mainnet", env.NEXT_PUBLIC_ALCHEMY_ID);

/**
 * Checks if the given string is an address
 *
 * @method isAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
 */
export const isAddress = (address: string) => {
  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
    // check if it has the basic requirements of an address
    return false;
  } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
    // If it's all small caps or all all caps, return true
    return true;
  } else {
    // Otherwise check each case
    return isChecksumAddress(address);
  }
};

/**
 * Checks if the given string is a checksummed address
 *
 * @method isChecksumAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
 */
export const isChecksumAddress = (address: string) => {
  // Check each case
  address = address.replace("0x", "");
  const addressHash = keccak256(address.toLowerCase());
  for (let i = 0; i < 40; i++) {
    // the nth letter should be uppercase if the nth digit of casemap is 1
    if (
      (parseInt(addressHash[i] || "", 16) > 7 && address[i]?.toUpperCase() !== address[i]) ||
      (parseInt(addressHash[i] || "", 16) <= 7 && address[i]?.toLowerCase() !== address[i])
    ) {
      return false;
    }
  }
  return true;
};

export const getContract = ({ address }: { address: string }): ethers.Contract => {
  const contract = new ethers.Contract(
    address,
    [
      {
        inputs: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
        ],
        name: "tokenURI",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "totalSupply",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    provider,
  );
  return contract;
};
