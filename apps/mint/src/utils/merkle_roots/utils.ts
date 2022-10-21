import { claimConfig, presaleConfig } from "@utils/merkle_roots";
import { ethers } from "ethers";
import keccak256 from "keccak256";
import MerkleTree from "merkletreejs";

/**
 * Generate Merkle Tree leaf from address and value
 * @param {string} address of airdrop claimee
 * @param {string} value of airdrop tokens to claimee
 * @returns {Buffer} Merkle Tree node
 */
export const generateLeaf = (address: string, value: string): Buffer => {
  return Buffer.from(
    // Hash in appropriate Merkle format
    ethers.utils
      .solidityKeccak256(["address", "uint256"], [address, value])
      .slice(2),
    "hex"
  );
};

// Setup merkle tree
export const presaleMerkleTree = new MerkleTree(
  // Generate leafs
  Object.entries(presaleConfig.whitelist).map(([address, tokens]) =>
    generateLeaf(ethers.utils.getAddress(address), tokens.toString())
  ),
  // Hashing function
  keccak256,
  { sortPairs: true }
);

export const claimMerkleTree = new MerkleTree(
  // Generate leafs
  Object.entries(claimConfig.whitelist).map(([address, tokens]) =>
    generateLeaf(ethers.utils.getAddress(address), tokens.toString())
  ),
  // Hashing function
  keccak256,
  { sortPairs: true }
);
