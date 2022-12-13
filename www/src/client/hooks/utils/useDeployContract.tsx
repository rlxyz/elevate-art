import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { useMutateRepositoryCreateDeploymentCreate } from '@hooks/trpc/repositoryContractDeployment/useMutateRepositoryContractDeploymentCreate'
import type { Signer } from 'ethers'
import { ContractFactory } from 'ethers'
import { useState } from 'react'
import { useSigner } from 'wagmi'
import contract from '../../utils/RhapsodyCreator.json'
import { useNotification } from './useNotification'

interface ERC721ContractInput {
  name: string
  symbol: string
  baseURI: string
  collectionSize: number
  maxPublicBatchPerAddress: number
  amountForPromotion: number
  mintPrice: string
  presaleTime: number
  publicTime: number
}

export const useDeployContract = () => {
  const { data: signer } = useSigner()
  const [address, setAddress] = useState('')
  const { notifySuccess } = useNotification()
  const { mutate } = useMutateRepositoryCreateDeploymentCreate()
  const deploymentId = useRepositoryStore((state) => state.deploymentId)
  const factory = new ContractFactory(contract.abi, contract.bytecode).connect(signer as Signer)

  const deploy = async (opts: ERC721ContractInput) => {
    const args = [
      opts.name,
      opts.symbol,
      opts.baseURI,
      opts.collectionSize,
      opts.maxPublicBatchPerAddress,
      opts.amountForPromotion,
      opts.mintPrice,
      opts.presaleTime,
      opts.publicTime,
    ]
    const tx = await factory.deploy(...args)
    console.log('args', tx)
    mutate({ deploymentId, address: tx.address, chainId: 5 }) // set to 5 for goerli, shoudl come from forom
    setAddress(tx.address)
    await tx.deployed()
    notifySuccess(`Contract deployed at ${tx.address}. We will now verify the contract.`)
  }

  return { deploy, address }
}
