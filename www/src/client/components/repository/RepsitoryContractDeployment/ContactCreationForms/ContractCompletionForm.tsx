import { useContractCreationStore } from '@hooks/store/useContractCreationStore'
import { useDeployContract } from '@hooks/utils/useDeployContract'
import Big from 'big.js'
import type { FC } from 'react'
import { ContractForm } from '../ContractForm'

export const ContractCompletionForm: FC<{ title: string; description: string }> = ({ title, description }) => {
  const { deploy, address: contractAddress } = useDeployContract()
  const { currentSegment, contractName, contractSymbol, mintType, blockchain, collectionSize, pricePerToken } = useContractCreationStore()
  const mintPrice = Big(pricePerToken)
    .times(10 ** 18)
    .toFixed(0)

  return (
    <>
      <ContractForm>
        <ContractForm.Header title={title} description={description} />
        <button
          className='border p-2 border-mediumGrey rounded-[5px] bg-blueHighlight text-white text-xs disabled:bg-lightGray disabled:cursor-not-allowed disabled:text-darkGrey'
          type='submit'
          onClick={async (e) => {
            e.preventDefault()
            try {
              await deploy({
                name: contractName,
                symbol: contractSymbol,
                collectionSize: collectionSize,
                maxPublicBatchPerAddress: 5,
                amountForPromotion: 10,
                mintPrice: mintPrice,
              })
            } catch (error) {
              console.error('err', error)
            }
          }}
        >
          Deploy
        </button>
      </ContractForm>
    </>
  )
}
