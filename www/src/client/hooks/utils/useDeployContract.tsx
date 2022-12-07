import { ContractFactory, Signer } from 'ethers'
import { useState } from 'react'
import { useSigner } from 'wagmi'
import contract from '../../utils/RhapsodyCreator.json'

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

  const factory = new ContractFactory(contract.abi, contract.bytecode).connect(signer as Signer)

  const deploy = async (opts: ERC721ContractInput) => {
    const args = [opts.name, opts.symbol, opts.collectionSize, opts.maxPublicBatchPerAddress, opts.amountForPromotion, opts.mintPrice]
    const tx = await factory.deploy(...args)
    setAddress(tx.address)
    await tx.deployed()
  }

  return { deploy, address }
}
