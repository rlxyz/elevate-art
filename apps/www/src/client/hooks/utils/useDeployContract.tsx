import type { SaleConfigMap } from '@components/deployments/contractDeployment/ContactCreationForm/useContractCreationStore'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { useMutateRepositoryCreateDeploymentCreate } from '@hooks/trpc/contractDeployment/useMutateRepositoryContractDeploymentCreate'
import type { AssetDeploymentBranch } from '@prisma/client'
import { AssetDeploymentType } from '@prisma/client'
import type { ContractInformationData, PayoutData } from '@utils/contracts/ContractData'
import type { Signer } from 'ethers'
import { ContractFactory } from 'ethers'
import { useState } from 'react'
import basicContract from 'src/shared/contracts/RhapsodyCreatorBasic.json'
import generativeContract from 'src/shared/contracts/RhapsodyCreatorGenerative.json'
import { useSigner } from 'wagmi'
import { useNotification } from './useNotification'

interface ERC721ContractInput {
  contractInformationData: ContractInformationData
  baseURI: string
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

  const getContractDeploymentType = (type: AssetDeploymentType) => {
    if (type === AssetDeploymentType.BASIC) {
      return basicContract
    } else if (type === AssetDeploymentType.GENERATIVE) {
      return generativeContract
    }
    return basicContract
  }

  // const validate = (opts: ERC721ContractInput): boolean => {
  //   // validation phase
  //   if (!opts.name) {
  //     notifyError('Issue with the contract form. Name is required.')
  //     return false
  //   }

  //   if (!opts.symbol) {
  //     notifyError('Issue with the contract form. Symbol is required.')
  //     return false
  //   }

  //   if (!opts.baseURI) {
  //     notifyError('Issue with the contract form. Base URI is required.')
  //     return false
  //   }

  //   if (!opts.collectionSize) {
  //     notifyError('Issue with the contract form. Collection size is required.')
  //     return false
  //   }

  //   if (!opts.maxPublicBatchPerAddress) {
  //     notifyError('Issue with the contract form. Max public batch per address is required.')
  //     return false
  //   }

  //   if (!opts.amountForPromotion) {
  //     notifyError('Issue with the contract form. Amount for promotion is required.')
  //     return false
  //   }

  //   if (!opts.mintPrice) {
  //     notifyError('Issue with the contract form. Mint price is required.')
  //     return false
  //   }

  //   if (!opts.claimTime) {
  //     notifyError('Issue with the contract form. Claim time is required.')
  //     return false
  //   }

  //   if (!opts.presaleTime) {
  //     notifyError('Issue with the contract form. Presale time is required.')
  //     return false
  //   }

  //   if (!opts.publicTime) {
  //     notifyError('Issue with the contract form. Public time is required.')
  //     return false
  //   }

  //   if (!opts.type) {
  //     notifyError('Issue with the contract form. Type is required.')
  //     return false
  //   }

  //   if (!opts.branch) {
  //     notifyError('Issue with the contract form. Branch is required.')
  //     return false
  //   }

  //   return true
  // }

  const deploy = async (opts: ERC721ContractInput) => {
    const { baseURI, saleConfig, contractInformationData } = opts
    const contract = getContractDeploymentType(opts.type)
    const factory = new ContractFactory(contract.abi, contract.bytecode).connect(signer as Signer)

    const { name, symbol, collectionSize, chainId } = contractInformationData
    const claimTime = saleConfig.get('Claim')?.startTimestamp.getTime()
    const presaleTime = saleConfig.get('Presale')?.startTimestamp.getTime()
    const publicTime = saleConfig.get('Public')?.startTimestamp.getTime()
    const mintPrice = saleConfig.get('Public')?.mintPrice
    const maxPublicBatchPerAddress = saleConfig.get('Public')?.maxAllocationPerAddress
    const amountForPromotion = 0

    if (!claimTime || !presaleTime || !publicTime || !mintPrice || !maxPublicBatchPerAddress) {
      return notifyError('Issue with the contract form. Please check the sale config.')
    }

    const args = [
      name,
      symbol,
      baseURI,
      collectionSize,
      maxPublicBatchPerAddress,
      amountForPromotion,
      mintPrice,
      Math.floor(claimTime / 1000),
      Math.floor(presaleTime / 1000),
      Math.floor(publicTime / 1000),
    ]

    const tx = await factory.deploy(...args)
    mutate({ deploymentId, address: tx.address, chainId }) // set to 5 for goerli, shoudl come from forom
    setAddress(tx.address)
    await tx.deployed()
    notifySuccess(`Contract deployed at ${tx.address}. We will now verify the contract.`)
  }

  return { deploy, address }
}
