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
  collectionSize: number
  maxPublicBatchPerAddress: number
  amountForPromotion: number
  mintPrice: string
}

export const useDeployContract = () => {
  const { data: signer } = useSigner()
  const [address, setAddress] = useState('')
  const { notifySuccess } = useNotification()
  const { mutate } = useMutateRepositoryCreateDeploymentCreate()
  const deploymentId = useRepositoryStore((state) => state.deploymentId)
  const factory = new ContractFactory(contract.abi, contract.bytecode).connect(signer as Signer)

  const deploy = async (opts: ERC721ContractInput) => {
    const args = [opts.name, opts.symbol, opts.collectionSize, opts.maxPublicBatchPerAddress, opts.amountForPromotion, opts.mintPrice]
    const tx = await factory.deploy(...args)
    mutate({ deploymentId, address: tx.address })
    setAddress(tx.address)
    await tx.deployed()
    notifySuccess(`Contract deployed at ${tx.address}. We will now verify the contract.`)
  }

  return { deploy, address }
}
