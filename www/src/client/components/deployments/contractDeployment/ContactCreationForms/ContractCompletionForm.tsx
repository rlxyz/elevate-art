import { useContractCreationStore } from '@hooks/store/useContractCreationStore'
import { useQueryRepositoryDeployments } from '@hooks/trpc/repositoryDeployment/useQueryRepositoryDeployments'
import { useDeployContract } from '@hooks/utils/useDeployContract'
import type { AssetDeploymentType } from '@prisma/client'
import { AssetDeploymentBranch } from '@prisma/client'
import Big from 'big.js'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import { env } from 'src/env/client.mjs'
import { ContractForm } from '../ContractForm'

export const ContractCompletionForm: FC<{ title: string; description: string }> = ({ title, description }) => {
  const { deploy, address: contractAddress } = useDeployContract()
  const { current: deployment } = useQueryRepositoryDeployments()
  const {
    currentSegment,
    artCollection,
    contractName,
    contractSymbol,
    mintType,
    blockchain,
    presale,
    presaleMaxMintAmount,
    presaleMaxTransactionAmount,
    presalePrice,
    presaleSupply,
    publicSale,
    publicSaleMaxMintAmount,
    publicSaleMaxTransactionAmount,
    publicSalePrice,
    pricePerToken,
  } = useContractCreationStore()
  const mintPrice = Big(pricePerToken)
    .times(10 ** 18)
    .toFixed(0)

  const router = useRouter()
  const organisationName = router.query.organisation as string
  const repositoryName = router.query.repository as string

  const handleClick = async (e) => {
    e.preventDefault()

    if (!deployment) {
      return
    }

    // @todo clean this up. just adds the /preview if its a preview deployment
    const baseURI = `${env.NEXT_PUBLIC_API_URL}/api/assets/${organisationName}/${repositoryName}${
      deployment.branch === AssetDeploymentBranch.PREVIEW ? '/preview' : ''
    }/${deployment?.name}/`

    try {
      await deploy({
        name: contractName,
        symbol: contractSymbol,
        baseURI,
        collectionSize: 10000,
        maxPublicBatchPerAddress: 5,
        amountForPromotion: 10,
        mintPrice: '33000000000000000',
        claimTime: new Date().getTime() + 1 * 60 * 60 * 1000, // @todo remove little hack, this does +4 hours
        presaleTime: new Date().getTime() + 2 * 60 * 60 * 1000, // @todo remove little hack, this does +2 hours
        publicTime: new Date().getTime() + 3 * 60 * 60 * 1000, // @todo remove little hack, this does +3 hours
        branch: deployment.branch as AssetDeploymentBranch,
        type: deployment.type as AssetDeploymentType,
      })
    } catch (error) {
      console.error('err', error)
    }
  }

  return (
    <>
      <ContractForm>
        <ContractForm.Header title={title} description={description} />
        <div className='w-full grid grid-cols-2 gap-2'>
          <div>
            {/* <button
              className='border p-2 border-mediumGrey rounded-[5px] bg-blueHighlight text-white text-xs disabled:bg-lightGray disabled:cursor-not-allowed disabled:text-darkGrey'
              type='submit'
              onClick={handleClick}
            >
              Deploy
            </button> */}
          </div>
          <div>
            <ContractForm.Body.Summary
              contractName={contractName}
              contractSymbol={contractSymbol}
              onClick={handleClick}
              blockchain={blockchain}
              mintType={mintType}
              artCollection={artCollection}
              currentSegment={currentSegment}
              presale={presale}
              presaleMaxMintAmount={presaleMaxMintAmount}
              presaleMaxTransactionAmount={presaleMaxTransactionAmount}
              presalePrice={presalePrice}
              presaleSupply={presaleSupply}
              publicSale={publicSale}
              publicSaleMaxMintAmount={publicSaleMaxMintAmount}
              publicSaleMaxTransactionAmount={publicSaleMaxTransactionAmount}
              publicSalePrice={publicSalePrice}
            />
          </div>
        </div>
      </ContractForm>
    </>
  )
}
