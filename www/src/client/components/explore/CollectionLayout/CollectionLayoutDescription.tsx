import { LayoutContainer } from '@components/layout/core/Layout'
import type { AssetDeployment, ContractDeployment, Organisation, Repository } from '@prisma/client'
import { buildEtherscanLink } from '@utils/ethers'
import type { ContractData } from '../ContractData'
import { CollectionContractDeploymentDetails } from './CollectionContractDeploymentDetails'
import { CollectionSocialMediaLinks } from './CollectionSocialMediaLinks'

interface MintLayoutDescriptionProps {
  repository: Repository | null | undefined
  organisation: Organisation | null | undefined
  deployment: AssetDeployment | null | undefined
  contractDeployment: ContractDeployment | null | undefined
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
        <CollectionContractDeploymentDetails
          repository={repository}
          organisation={organisation}
          deployment={deployment}
          contractDeployment={contractDeployment}
          contractData={contractData}
        />
        {contractDeployment && (
          <CollectionSocialMediaLinks
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
