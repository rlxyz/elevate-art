import { SocialMediaLink } from '@Components/core/Minter/SocialMediaLink'
import { buildEtherscanLink } from '@Components/core/Unused'
import { LayoutContainer } from '@Components/ui/core/Layout'
import type { Organisation, Repository, RepositoryContractDeployment, RepositoryDeployment } from '@prisma/client'
import React from 'react'
import type { ContractData } from 'src/pages/[address]'
import { ContractDeploymentDetails } from '../core/ContractDeploymentDetails'

interface MintLayoutDescriptionProps {
  repository: Repository | null | undefined
  organisation: Organisation | null | undefined
  deployment: RepositoryDeployment | null | undefined
  contractDeployment: RepositoryContractDeployment | null | undefined
  contractData: ContractData | null | undefined
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
        {contractDeployment && (
          <SocialMediaLink
            discordUrl={contractDeployment.discordUrl}
            twitterUrl={contractDeployment.twitterUrl}
            etherscanUrl={buildEtherscanLink({
              address: contractDeployment.address,
              chainId: contractDeployment.chainId,
            })}
          />
        )}
      </div>
    </LayoutContainer>
  )
}
