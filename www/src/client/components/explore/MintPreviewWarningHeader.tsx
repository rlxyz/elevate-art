import LinkComponent from '@components/layout/link/Link'
import type { AssetDeployment, ContractDeployment, Organisation, Repository } from '@prisma/client'
import { AssetDeploymentBranch } from '@prisma/client'
import { AssetDeploymentNavigationEnum, ZoneNavigationEnum } from '@utils/enums'
import { parseChainId } from '@utils/ethers'
import { capitalize, routeBuilder, toPascalCaseWithSpace } from 'src/client/utils/format'

export const MintPreviewWarningHeader = ({
  repository,
  organisation,
  assetDeployment,
  contractDeployment,
}: {
  contractDeployment: ContractDeployment
  repository: Repository
  organisation: Organisation
  assetDeployment: AssetDeployment
}) => (
  <div className='border-b border-mediumGrey w-screen flex items-center justify-center py-2 bg-lightGray'>
    <span className='text-xs'>
      Note, this is a{' '}
      <LinkComponent
        underline
        target='_blank'
        rel='noopener noreferrer'
        href={routeBuilder(
          organisation.name,
          repository.name,
          ZoneNavigationEnum.enum.Deployments,
          assetDeployment.name,
          AssetDeploymentNavigationEnum.enum.Contract
        )}
        className='w-fit'
      >
        <strong className='text-blueHighlight'>{toPascalCaseWithSpace(AssetDeploymentBranch.PREVIEW)}</strong>
      </LinkComponent>{' '}
      contract on <strong>{capitalize(parseChainId(contractDeployment.chainId || 99))}</strong>. Only authenticated users of this project
      can view this page.
    </span>
  </div>
)
