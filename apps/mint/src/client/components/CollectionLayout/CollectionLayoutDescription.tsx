import { LayoutContainer } from '@Components/layout/core/Layout'
import type { Organisation, Repository, RepositoryContractDeployment, RepositoryDeployment } from '@prisma/client'
import React from 'react'
import type { ContractData } from 'src/pages/[address]'
import { ContractDeploymentDetails } from '../core/ContractDeploymentDetails'
import { SocialMediaLink } from '../core/Minter/SocialMediaLink'
import { buildEtherscanLink } from '../core/Unused'

interface MintLayoutDescriptionProps {
  repository: Repository
  organisation: Organisation
  deployment: RepositoryDeployment
  contractDeployment: RepositoryContractDeployment
  contractData: ContractData
}

export const CollectionLayoutDescription: React.FC<MintLayoutDescriptionProps> = ({
  repository,
  organisation,
  deployment,
  contractDeployment,
  contractData,
}) => {
  return (
    <LayoutContainer border='none'>
      <div className='w-full flex justify-between items-start'>
        <ContractDeploymentDetails
          repository={repository}
          organisation={organisation}
          deployment={deployment}
          contractDeployment={contractDeployment}
          contractData={contractData}
        />
        <SocialMediaLink
          discordUrl={contractDeployment.discordUrl}
          twitterUrl={contractDeployment.twitterUrl}
          etherscanUrl={buildEtherscanLink({
            address: contractDeployment.address,
            chainId: contractDeployment.chainId,
          })}
        />
      </div>
    </LayoutContainer>
  )
}
