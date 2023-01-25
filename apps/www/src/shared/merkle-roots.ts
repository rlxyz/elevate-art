import type { ContractDeploymentAllowlist } from '@prisma/client'
import { getAddress, solidityKeccak256 } from 'ethers/lib/utils.js'
import keccak256 from 'keccak256'
import MerkleTree from 'merkletreejs'

/**
 * Generate Merkle Tree leaf from address and value
 * @param {string} address of airdrop claimee
 * @param {string} value of airdrop tokens to claimee
 * @returns {Buffer} Merkle Tree node
 */
export const generateLeaf = (whitelist: ContractDeploymentAllowlist): Buffer => {
  return Buffer.from(solidityKeccak256(['address', 'uint256'], [getAddress(whitelist.address), whitelist.mint]).slice(2), 'hex')
}

export const createMerkleTree = (whitelist: ContractDeploymentAllowlist[]): MerkleTree => {
  return new MerkleTree(
    // Generate leafs
    whitelist.map((whitelist) => generateLeaf(whitelist)),
    // Hashing function
    keccak256,
    { sortPairs: true }
  )
}
