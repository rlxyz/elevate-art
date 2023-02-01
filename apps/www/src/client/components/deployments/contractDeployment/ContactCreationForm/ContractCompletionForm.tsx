import useContractCreationStore from '@components/deployments/contractDeployment/ContactCreationForm/useContractCreationStore'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import { useQueryRepositoryFindByName } from '@hooks/trpc/repository/useQueryRepositoryFindByName'
import { useQueryRepositoryDeployments } from '@hooks/trpc/repositoryDeployment/useQueryRepositoryDeployments'
import { useDeployContract } from '@hooks/utils/useDeployContract'
import { useNotification } from '@hooks/utils/useNotification'
import type { AssetDeploymentBranch, AssetDeploymentType } from '@prisma/client'
import Image from 'next/image'
import type { FC } from 'react'
import type { ContractFormProps } from '.'
import { ContractForm } from './ContractForm'

export const ContractCompletionForm: FC<ContractFormProps> = ({ title, description, next, previous }) => {
  const { deploy } = useDeployContract()
  const { current: deployment } = useQueryRepositoryDeployments()
  const { currentSegment, contractInformationData, saleConfig, payoutData } = useContractCreationStore()
  const { current: organisation } = useQueryOrganisationFindAll()
  const { current: repository } = useQueryRepositoryFindByName()
  const { notifyError } = useNotification()

  const handleClick = async () => {
    if (!organisation || !repository || !contractInformationData || !deployment) {
      console.log('deployment of contract failed')
      return notifyError('Deployment of contract failed. Please submit a ticket in Discord')
    }

    try {
      await deploy(
        {
          payoutData,
          contractInformationData,
          saleConfig,
          branch: deployment.branch as AssetDeploymentBranch,
          type: deployment.type as AssetDeploymentType,
        },
        organisation,
        repository,
        deployment
      )
    } catch (error) {
      console.error('err', error)
    }
  }

  return (
    <>
      <ContractForm>
        <ContractForm.Header title={title} description={description} />
        <div className='flex flex-col space-y-3'>
          <ContractForm.Body.Summary
            next={next}
            previous={previous}
            onClick={handleClick}
            current={currentSegment}
            contractInformationData={contractInformationData}
            saleConfig={saleConfig}
          >
            <button
              className='border px-2 py-1 w-full justify-center border-mediumGrey rounded-[5px] bg-blueHighlight text-white text-xs disabled:bg-lightGray disabled:cursor-not-allowed disabled:text-darkGrey flex items-center space-x-1'
              type='submit'
              onClick={(e) => {
                e.preventDefault()
                handleClick()
              }}
            >
              <Image width={32} height={32} src='/images/logo-white.png' alt='logo-white' />
              <span className='uppercase font-semibold text-xs'>Deploy</span>
            </button>
          </ContractForm.Body.Summary>
        </div>
      </ContractForm>
    </>
  )
}
