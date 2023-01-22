import useContractCreationStore from '@components/deployments/contractDeployment/ContactCreationForm/useContractCreationStore'
import Card from '@components/layout/card/Card'
import { useQueryRepositoryDeployments } from '@hooks/trpc/repositoryDeployment/useQueryRepositoryDeployments'
import { useDeployContract } from '@hooks/utils/useDeployContract'
import type { AssetDeploymentBranch, AssetDeploymentType } from '@prisma/client'
import Image from 'next/image'
import type { FC } from 'react'
import type { ContractFormProps } from '.'
import { ContractForm } from './ContractForm'

const createBaseUriHash = () => {}

export const ContractCompletionForm: FC<ContractFormProps> = ({ title, description, next, previous }) => {
  const { deploy } = useDeployContract()
  const { current: deployment } = useQueryRepositoryDeployments()
  const { currentSegment, contractInformationData, saleConfig, payoutData } = useContractCreationStore()

  const handleClick = async () => {
    if (!deployment) {
      return
    }

    if (!contractInformationData) {
      return
    }

    try {
      await deploy({
        payoutData,
        contractInformationData,
        saleConfig,
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
        <div className='w-full grid grid-cols-2 gap-6'>
          <Card>
            <button
              className='border px-2 py-1 border-mediumGrey rounded-[5px] bg-blueHighlight text-white text-xs disabled:bg-lightGray disabled:cursor-not-allowed disabled:text-darkGrey flex items-center space-x-1'
              type='submit'
              onClick={(e) => {
                e.preventDefault()
                handleClick()
              }}
            >
              <Image width={32} height={32} src='/images/logo-white.png' alt='logo-white' />
              <span className='uppercase font-semibold text-xs'>Deploy</span>
            </button>
          </Card>
          <div>
            <ContractForm.Body.Summary
              next={next}
              previous={previous}
              onClick={handleClick}
              current={currentSegment}
              contractInformationData={contractInformationData}
              saleConfig={saleConfig}
            />
          </div>
        </div>
      </ContractForm>
    </>
  )
}
