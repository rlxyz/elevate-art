import {
  presaleConfig,
  claimConfig,
  presaleMerkleTree,
  claimMerkleTree,
  generateLeaf,
} from "@utils/merkle_roots";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { createContainer } from "unstated-next";
import { useWallet } from "@hooks/useWallet";
import { useNotify } from "@hooks/useNotify";
import { COLLECTION_DISTRIBUTION } from "@utils/constant";

export type MintPhase = "none" | "claim" | "presale" | "public";

function useToken() {
  const { address, provider } = useWallet();

  const { notifyError, notifySuccess, notifySubmitted } = useNotify();

  // Local state
  const [mintPhase, setMintPhase] = useState<MintPhase>("none");
  const [dataLoading, setDataLoading] = useState<boolean>(true); // Data retrieval status
  const [claimMaxInvocation, setClaimMaxInvocation] = useState<number>(0); // Max number for free claim period
  const [presaleMaxInvocation, setPresaleMaxInvocation] = useState<number>(0); // Max number for presale period
  const [publicMaxInvocation, setPublicMaxInvocation] = useState<number>(0);
  const [presaleMinted, setPresaleMinted] = useState<boolean>(false); // Claim status
  const [mintPrice, setMintPrice] = useState<number>(0); // Claim status
  const [totalSupply, setTotalSupply] = useState<number>(0);
  const [mintCount, setMintCount] = useState<number>(0);
  const [claimTime, setClaimTime] = useState<number>(null);
  const [presaleTime, setPresaleTime] = useState<number>(null);
  const [publicTime, setPublicTime] = useState<number>(null);

  /**
   * Get contract
   * @returns {ethers.Contract} signer-initialized contract
   */
  const getContract = (): ethers.Contract => {
    return new ethers.Contract(
      // Contract address
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? "",
      [
        "function claimMint(uint256 invocations, bytes32[] calldata proof) external",
        "function presaleMint(uint256 invocations, uint256 maxInvocation, bytes32[] calldata proof) public payable",
        "function publicMint(uint256 invocations) external payable",
        "function presaleTime() public view returns (uint256)",
        "function publicTime() public view returns (uint256)",
        "function claimTime() public view returns (uint256)",
        "function totalSupply() public view returns (uint256)",
        "function balanceOf(address) public view returns (uint256)",
        "function maxPublicBatchPerAddress() public view returns (uint256)",
        "function mintPrice() public view returns (uint256)",
        "function mintOf(address) public view returns (uint256)",
        "function claimMerkleRoot() public view returns (bytes32)",
        "function presaleMerkleRoot() public view returns (bytes32)",
      ],
      // Get signer from authed provider
      provider?.getSigner()
    );
  };

  // note: user can only mint once in public mint
  const getPresaleMaxInvocation = async (address: string): Promise<number> => {
    // If address is in airdrop
    const formattedAddress = ethers.utils.getAddress(address);

    if (formattedAddress in presaleConfig.whitelist) {
      return presaleConfig.whitelist[formattedAddress];
    } else if (address in presaleConfig.whitelist) {
      return presaleConfig.whitelist[address];
    } else if (address.toLowerCase() in presaleConfig.whitelist) {
      return presaleConfig.whitelist[address.toLowerCase()];
    } else {
      return 0;
    }
  };

  const getClaimMaxInvocation = async (address: string): Promise<number> => {
    // If address is in airdrop
    const formattedAddress = ethers.utils.getAddress(address);

    if (formattedAddress in claimConfig.whitelist) {
      return claimConfig.whitelist[formattedAddress];
    } else if (address in claimConfig.whitelist) {
      return claimConfig.whitelist[address];
    } else if (address.toLowerCase() in claimConfig.whitelist) {
      return claimConfig.whitelist[address.toLowerCase()];
    } else {
      return 0;
    }
  };

  const getPublicMaxInvocation = async (address: string): Promise<number> => {
    const totalSupply = await getTotalSupply();
    const mintCount = await getMintCount(address);
    const totalMintLeft =
      COLLECTION_DISTRIBUTION.maxPublicBatchPerAddress - mintCount;

    if (
      totalSupply + COLLECTION_DISTRIBUTION.maxPublicBatchPerAddress >
      COLLECTION_DISTRIBUTION.totalSupply
    ) {
      const collectionLeft = COLLECTION_DISTRIBUTION.totalSupply - totalSupply;
      if (totalMintLeft < collectionLeft) {
        return totalMintLeft;
      }
      return collectionLeft;
    }

    return totalMintLeft;
  };

  const getMintCount = async (address: string): Promise<number> => {
    const token: ethers.Contract = getContract();
    return (await token.mintOf(address)).toNumber();
  };

  const getMintPrice = async (): Promise<number> => {
    const token: ethers.Contract = getContract();
    return Number(ethers.utils.formatEther(await token.mintPrice()));
  };

  const getPresaleMinted = async (address: string): Promise<boolean> => {
    return (await getMintCount(address)) > 0;
  };

  const getPresaleTime = async (): Promise<number> => {
    const token: ethers.Contract = getContract();
    return (await token.presaleTime()).toNumber();
  };

  const getClaimTime = async (): Promise<number> => {
    const token: ethers.Contract = getContract();
    return (await token.claimTime()).toNumber();
  };

  const getPublicTime = async (): Promise<number> => {
    const token: ethers.Contract = getContract();
    return (await token.publicTime()).toNumber();
  };

  const getTotalSupply = async (): Promise<number> => {
    const token: ethers.Contract = getContract();
    return (await token.totalSupply()).toNumber();
  };

  const logMerkleRoot = async (): Promise<void> => {
    try {
      const token: ethers.Contract = getContract();
      const claimMerkleRoot = await token.claimMerkleRoot();
      const presaleMerkleRoot = await token.presaleMerkleRoot();

      console.log({ claimMerkleRoot, presaleMerkleRoot });
    } catch (err) {}
  };

  const captureError = (err) => {
    if (err.code === "UNPREDICTABLE_GAS_LIMIT") {
      notifyError({
        message:
          "Gas is expensive right now, and you do not have enough gas for the transaction. Please try again later.",
        err,
      });
    } else if (err.code === "INSUFFICIENT_FUNDS") {
      notifyError({
        message: "You do not have the required ETH to purchase your Reflection",
        err,
      });
    } else if (err.code === 4001 || err.code === -32603) {
      notifyError({
        message: err.message,
      });
    } else {
      notifyError({
        message:
          "Something went wrong with the transaction. Please submit a support ticket in our Discord.",
        err,
      });
    }
  };

  const claimMint = async (
    invocations: number,
    callbackFn?: (txHash: string) => void
  ): Promise<void> => {
    // If not authenticated throw
    if (!address) {
      throw new Error("Not Authenticated");
    }

    // Collect token contract
    const token: ethers.Contract = getContract();

    // Get properly formatted address
    const formattedAddress = ethers.utils.getAddress(address);

    // Max Invocations
    const maxInvocation: number = await getClaimMaxInvocation(address);

    // Get tokens for address
    if (invocations > maxInvocation) {
      notifyError({
        message: "Trying to mint too many.",
      });
      return;
    } else if (invocations < maxInvocation) {
      notifyError({
        message: "Trying to mint too little.",
      });
      return;
    }

    const overrides = {
      gasLimit: COLLECTION_DISTRIBUTION.gasLimit,
    };

    // Generate hashed leaf from address
    const leaf: Buffer = generateLeaf(
      formattedAddress,
      maxInvocation.toString()
    );

    // Generate airdrop proof
    const proof: string[] = claimMerkleTree.getHexProof(leaf);

    try {
      // Try to claim airdrop and refresh sync status
      const tx = await token.claimMint(invocations, proof, overrides);
      const txHash = tx.hash;
      notifySubmitted(txHash, 10000);

      const txResponse = await tx.wait();

      if (txResponse !== null && callbackFn) {
        notifySuccess();
        callbackFn(txHash);
      }
    } catch (err) {
      console.error(err);
      captureError(err);
    }
    await syncStatus();
  };

  const presaleMint = async (
    invocations: number,
    callbackFn?: (txHash: string) => void
  ): Promise<void> => {
    // If not authenticated throw
    if (!address) {
      throw new Error("Not Authenticated");
    }

    // Collect token contract
    const token: ethers.Contract = getContract();

    // Get properly formatted address
    const formattedAddress = ethers.utils.getAddress(address);

    const maxInvocation: number = await getPresaleMaxInvocation(address);

    // Get tokens for address
    if (invocations > maxInvocation) {
      notifyError({ message: "Trying to mint too many" });
      return;
    }

    let valueMint: number;
    if (invocations === 1) {
      valueMint = COLLECTION_DISTRIBUTION.oneMintPrice;
    } else {
      valueMint = COLLECTION_DISTRIBUTION.twoMintPrice;
    }

    const overrides = {
      value: ethers.utils.parseEther(valueMint.toString()),
      gasLimit: COLLECTION_DISTRIBUTION.gasLimit,
    };

    // Generate hashed leaf from address
    const leaf: Buffer = generateLeaf(
      formattedAddress,
      maxInvocation.toString()
    );

    // Generate airdrop proof
    const proof: string[] = presaleMerkleTree.getHexProof(leaf);

    try {
      // Try to claim airdrop and refresh sync status
      const tx = await token.presaleMint(
        invocations,
        maxInvocation,
        proof,
        overrides
      );
      const txHash = tx.hash;
      notifySubmitted(txHash);

      const txResponse = await tx.wait();

      if (txResponse !== null && callbackFn) {
        notifySuccess();
        callbackFn(txHash);
      }
    } catch (err) {
      console.error(err);
      captureError(err);
    }
    await syncStatus();
  };

  const publicMint = async (
    invocations: number,
    callbackFn?: (txHash: string) => void
  ): Promise<void> => {
    if (!address) {
      throw new Error("Not Authenticated");
    }

    const maxInvocation: number = await getPublicMaxInvocation(address);

    if (invocations > maxInvocation) {
      notifyError({ message: "Trying to mint too many." });
      return;
    }

    let valueMint: number;
    if (invocations == 1) {
      valueMint = COLLECTION_DISTRIBUTION.oneMintPrice;
    } else {
      valueMint = COLLECTION_DISTRIBUTION.twoMintPrice;
    }

    const overrides = {
      value: ethers.utils.parseEther(valueMint.toString()),
      gasLimit: COLLECTION_DISTRIBUTION.gasLimit,
    };

    const token: ethers.Contract = getContract();

    try {
      const tx = await token.publicMint(invocations, overrides);
      const txHash = tx.hash;
      notifySubmitted(txHash);

      const txResponse = await tx.wait();

      if (txResponse !== null && callbackFn) {
        notifySuccess();
        callbackFn(txHash);
      }
    } catch (err) {
      console.log({ err });
      captureError(err);
    }

    await syncStatus();
  };

  const getTokenIdsFromTxHash = async (txHash: string): Promise<number[]> => {
    try {
      const receipt = await provider.getTransactionReceipt(txHash);
      return receipt.logs.map((log) => parseInt(log.topics[3]));
    } catch (_) {
      return [];
    }
  };

  /**
   * After authentication, update number of tokens to claim + claim status
   */
  const syncStatus = async (): Promise<void> => {
    setDataLoading(true);
    try {
      if (address) {
        const _mintCount = await getMintCount(address);
        setMintCount(_mintCount);

        const _claimMaxInvocations = await getClaimMaxInvocation(address);
        setClaimMaxInvocation(_claimMaxInvocations);

        const _presaleMaxInvocations = await getPresaleMaxInvocation(address);
        setPresaleMaxInvocation(_presaleMaxInvocations);

        const _publicMaxInvocation = await getPublicMaxInvocation(address);
        setPublicMaxInvocation(_publicMaxInvocation);

        if (_presaleMaxInvocations > 0) {
          const presaleMinted = await getPresaleMinted(address);
          setPresaleMinted(presaleMinted);
        }

        const _mintPrice = await getMintPrice();
        setMintPrice(_mintPrice);

        const _totalSupply = await getTotalSupply();
        setTotalSupply(_totalSupply);

        const _publicTime = await getPublicTime();
        const _presaleTime = await getPresaleTime();
        const _claimTime = await getClaimTime();

        setClaimTime(_claimTime);
        setPresaleTime(_presaleTime);
        setPublicTime(_publicTime);

        const now = Math.floor(Date.now() / 1000);
        if (
          _presaleTime == null ||
          _publicTime == null ||
          _claimTime === null
        ) {
          setMintPhase("none");
        }
        if (now > _claimTime && now < _presaleTime) {
          setMintPhase("claim");
        } else if (now > _presaleTime && now < _publicTime) {
          setMintPhase("presale");
        } else if (now > _publicTime) {
          setMintPhase("public");
        } else {
          setMintPhase("none");
        }
      }
    } catch (error) {
      console.error({ source: "Token::syncStatus", error });
    }

    setDataLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      console.log({ claimTime, presaleTime, publicTime });
      await logMerkleRoot();
    };
    init();
  }, [claimTime, presaleTime, publicTime]);

  // On load:
  useEffect(() => {
    console.log({
      ContractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      ClaimMerkleTree: claimMerkleTree.getHexRoot(),
      PresaleMerkleTree: presaleMerkleTree.getHexRoot(),
    });
    syncStatus();
  }, [address]);

  return {
    dataLoading,
    claimMaxInvocation,
    presaleMaxInvocation,
    publicMaxInvocation,
    presaleMinted,
    claimMint,
    presaleMint,
    publicMint,
    getTokenIdsFromTxHash,
    mintPhase,
    totalSupply,
    mintPrice,
    mintCount,
  };
}

interface TokenProps {
  dataLoading: boolean;
  claimMaxInvocation: number;
  presaleMaxInvocation: number;
  publicMaxInvocation: number;
  presaleMinted: boolean;
  mintPhase: MintPhase;
  claimMint: (
    invocations: number,
    callbackFn?: (txHash: string) => void
  ) => Promise<void>;
  presaleMint: (
    invocations: number,
    callbackFn?: (txHash: string) => void
  ) => Promise<void>;
  publicMint: (
    invocations: number,
    callbackFn?: (txHash: string) => void
  ) => Promise<void>;
  getTokenIdsFromTxHash: (txHash: string) => Promise<number[]>;
  totalSupply: number;
  mintPrice: number;
  mintCount: number;
}

// Create unstated-next container
export const Token = createContainer<TokenProps>(useToken);
