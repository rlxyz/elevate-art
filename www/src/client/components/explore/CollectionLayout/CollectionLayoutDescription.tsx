import { LayoutContainer } from '@components/layout/core/Layout'
import type { AssetDeployment, ContractDeployment, Organisation, Repository } from '@prisma/client'
import { buildEtherscanLink } from '@utils/ethers'
import type { RhapsodyContractData } from '../../../../shared/contracts/ContractData'
import { CollectionContractDeploymentDetails } from './CollectionContractDeploymentDetails'
import { CollectionSocialMediaLinks } from './CollectionSocialMediaLinks'

interface MintLayoutDescriptionProps {
  repository: Repository | null | undefined
  organisation: Organisation | null | undefined
  deployment: AssetDeployment | null | undefined
  contractDeployment: ContractDeployment | null | undefined
  contractData: RhapsodyContractData | null | undefined
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
        {contractDeployment && repository && organisation && (
          <CollectionSocialMediaLinks
            discordUrl={organisation.discordUrl}
            twitterUrl={organisation.twitterUrl}
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
