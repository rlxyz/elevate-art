import { useQueryRepositoryDeployments } from '@hooks/trpc/repositoryDeployment/useQueryRepositoryDeployments'
import { useDeployContract } from '@hooks/utils/useDeployContract'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import { env } from 'src/env/client.mjs'
import { ContractForm } from '../ContractForm'

export const ContractCompletionForm: FC<{ title: string; description: string }> = ({ title, description }) => {
  const { deploy, address: contractAddress } = useDeployContract()
  const { current: deployment } = useQueryRepositoryDeployments()
  const router = useRouter()
  const organisationName = router.query.organisation as string
  const repositoryName = router.query.repository as string
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
                name: 'test-deployment-contract',
                symbol: 'EA-TDC',
                baseURI: `${env.NEXT_PUBLIC_API_URL}/api/asset/${organisationName}/${repositoryName}/${deployment?.name}/}`,
                collectionSize: 10000,
                maxPublicBatchPerAddress: 5,
                amountForPromotion: 10,
                mintPrice: '333000000000000000',
                presaleTime: 1670819400,
                publicTime: 1670823000,
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
