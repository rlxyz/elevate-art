import LinkComponent from '@Components/ui/link/Link'
import type { AssetDeployment, ContractDeployment, Organisation, Repository } from '@prisma/client'
import { AssetDeploymentBranch } from '@prisma/client'
import { capitalize } from '@Utils/format'
import { env } from 'src/env/client.mjs'
import { parseChainId } from 'src/shared/ethers'

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
        href={`${env.NEXT_PUBLIC_COMPILER_CLIENT_URL}/${organisation.name}/${repository.name}/deployments/${assetDeployment.name}/contract`}
        className='w-fit'
      >
        <strong className='text-blueHighlight'>{capitalize(AssetDeploymentBranch.PREVIEW)}</strong>
      </LinkComponent>{' '}
      contract on <strong>{capitalize(parseChainId(contractDeployment.chainId || 99))}</strong>. Only authenticated users of this project
      can view this page.
    </span>
  </div>
)
