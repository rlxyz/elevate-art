import { ethers } from 'ethers'
import keccak256 from 'keccak256'
import MerkleTree from 'merkletreejs'

/**
 * Generate Merkle Tree leaf from address and value
 * @param {string} address of airdrop claimee
 * @param {string} value of airdrop tokens to claimee
 * @returns {Buffer} Merkle Tree node
 */

type IWhitelist = {
  whitelist: Record<string, number>
}

// Config from generator
const presaleConfig: IWhitelist = {
  whitelist: {
    '0xcd3B766CCDd6AE721141F452C550Ca635964ce71': 1,
    '0x90F79bf6EB2c4f870365E785982E1f101E93b906': 1,
    '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199': 1,
    '0xdD2FD4581271e230360230F9337D5c0430Bf44C0': 1,
    '0x71bE63f3384f5fb98995898A86B02Fb2426c5788': 1,
  },
}

export const generateLeaf = (address: string, value: string): Buffer => {
  return Buffer.from(
    // Hash in appropriate Merkle format
    ethers.utils.solidityKeccak256(['address', 'uint256'], [address, value]).slice(2),
    'hex'
  )
}

// Setup merkle tree
export const presaleMerkleTree = new MerkleTree(
  // Generate leafs
  Object.entries(presaleConfig.whitelist).map(([address, tokens]) => generateLeaf(ethers.utils.getAddress(address), tokens.toString())),
  // Hashing function
  keccak256,
  { sortPairs: true }
)

// export const claimMerkleTree = new MerkleTree(
//   // Generate leafs
//   Object.entries(claimConfig.whitelist).map(([address, tokens]) => generateLeaf(ethers.utils.getAddress(address), tokens.toString())),
//   // Hashing function
//   keccak256,
//   { sortPairs: true }
// )
