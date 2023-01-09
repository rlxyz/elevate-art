import { getAddress, solidityKeccak256 } from 'ethers/lib/utils.js'
import keccak256 from 'keccak256'
import MerkleTree from 'merkletreejs'

/**
 * Generate Merkle Tree leaf from address and value
 * @param {string} address of airdrop claimee
 * @param {string} value of airdrop tokens to claimee
 * @returns {Buffer} Merkle Tree node
 */
export const generateLeaf = (address: string, value: string): Buffer => {
  return Buffer.from(
    // Hash in appropriate Merkle format
    solidityKeccak256(['address', 'uint256'], [address, value]).slice(2),
    'hex'
  )
}

export const createMerkleTree = (whitelist: Record<string, string>): MerkleTree => {
  return new MerkleTree(
    // Generate leafs
    Object.entries(whitelist).map(([address, value]) => generateLeaf(getAddress(address), value.toString())),
    // Hashing function
    keccak256,
    { sortPairs: true }
  )
}
