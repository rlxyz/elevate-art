import type { SaleConfigMap } from '@components/deployments/contractDeployment/ContactCreationForm/useContractCreationStore'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { useMutateRepositoryCreateDeploymentCreate } from '@hooks/trpc/contractDeployment/useMutateRepositoryContractDeploymentCreate'
import type { AssetDeploymentBranch } from '@prisma/client'
import { AssetDeploymentType } from '@prisma/client'
import type { ContractInformationData, PayoutData } from '@utils/contracts/ContractData'
import { MINT_RANDOMIZER_CONTRACT } from '@utils/ethers'
import type { BigNumber, Signer } from 'ethers'
import { ContractFactory } from 'ethers'
import { useState } from 'react'
import basicContract from 'src/shared/contracts/RhapsodyCreatorBasic.json'
import generativeContract from 'src/shared/contracts/RhapsodyCreatorGenerative.json'
import { useSigner } from 'wagmi'
import { useChangeNetwork } from './useChangeNetwork'
import { useNotification } from './useNotification'

interface ERC721ContractInput {
  contractInformationData: ContractInformationData
  saleConfig: SaleConfigMap
  payoutData: PayoutData
  type: AssetDeploymentType
  branch: AssetDeploymentBranch
}

export const useDeployContract = () => {
  const { data: signer } = useSigner()
  const [address, setAddress] = useState('')
  const { notifySuccess, notifyError } = useNotification()
  const { mutate } = useMutateRepositoryCreateDeploymentCreate()
  const deploymentId = useRepositoryStore((state) => state.deploymentId)
  const { changeNetwork } = useChangeNetwork()
  const getContractDeploymentType = (type: AssetDeploymentType) => {
    if (type === AssetDeploymentType.BASIC) {
      return basicContract
    } else if (type === AssetDeploymentType.GENERATIVE) {
      return generativeContract
    }
    return basicContract
  }

  const createArgsForGenerative = (opts: ERC721ContractInput) => {
    const { saleConfig, contractInformationData } = opts
    const { name, symbol, collectionSize } = contractInformationData
    const claimTime = saleConfig.get('Claim')?.startTimestamp.getTime()
    const presaleTime = saleConfig.get('Presale')?.startTimestamp.getTime()
    const publicTime = saleConfig.get('Public')?.startTimestamp.getTime()
    const mintPrice = saleConfig.get('Public')?.mintPrice
    const maxMintPerAddress = saleConfig.get('Public')?.maxMintPerAddress
    const mintRandomizerContract = MINT_RANDOMIZER_CONTRACT
    const amountForPromotion = 0

    if (!claimTime || !presaleTime || !publicTime || !mintPrice || !maxMintPerAddress) {
      return null
    }

    const args = [
      name,
      symbol,
      mintRandomizerContract,
      collectionSize,
      maxMintPerAddress,
      amountForPromotion,
      mintPrice,
      Math.floor(claimTime / 1000),
      Math.floor(presaleTime / 1000),
      Math.floor(publicTime / 1000),
    ]

    return args
  }

  const createArgsForBasic = (opts: ERC721ContractInput) => {
    const { saleConfig, contractInformationData } = opts
    const { name, symbol, collectionSize } = contractInformationData
    const claimTime = saleConfig.get('Claim')?.startTimestamp.getTime()
    const presaleTime = saleConfig.get('Presale')?.startTimestamp.getTime()
    const publicTime = saleConfig.get('Public')?.startTimestamp.getTime()
    const mintPrice = saleConfig.get('Public')?.mintPrice
    const maxMintPerAddress = saleConfig.get('Public')?.maxMintPerAddress
    const amountForPromotion = 0

    if (!claimTime || !presaleTime || !publicTime || !mintPrice || !maxMintPerAddress) {
      return null
    }

    const args = [
      name,
      symbol,
      mintPrice,
      collectionSize,
      maxMintPerAddress,
      amountForPromotion,
      mintPrice,
      Math.floor(claimTime / 1000),
      Math.floor(presaleTime / 1000),
      Math.floor(publicTime / 1000),
    ]

    return args
  }

  const deploy = async (opts: ERC721ContractInput) => {
    // get chainId
    const { chainId } = opts.contractInformationData

    changeNetwork(chainId)

    let args: (string | number | BigNumber)[] | null = []
    if (opts.type === AssetDeploymentType.GENERATIVE) {
      args = createArgsForGenerative(opts)
    } else {
      args = createArgsForBasic(opts)
    }

    if (!args) {
      return notifyError('Issue with the contract form. Please check the sale config.')
    }

    const contract = getContractDeploymentType(opts.type)
    const factory = new ContractFactory(contract.abi, contract.bytecode).connect(signer as Signer)

    const tx = await factory.deploy(...args)
    mutate({ deploymentId, address: tx.address, chainId }) // set to 5 for goerli, shoudl come from forom
    setAddress(tx.address)
    await tx.deployed()
    notifySuccess(`Contract deployed at ${tx.address}. We will now verify the contract.`)
  }

  return { deploy, address }
}
