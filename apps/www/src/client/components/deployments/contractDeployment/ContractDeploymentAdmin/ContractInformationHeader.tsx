import LinkComponent from '@components/layout/link/Link'
import type { AssetDeployment, ContractDeployment, Organisation, Repository } from '@prisma/client'
import { parseChainId } from '@utils/ethers'
import { capitalize, routeBuilder, toPascalCaseWithSpace } from 'src/client/utils/format'
import { MintNavigationEnum, ZoneNavigationEnum } from 'src/shared/enums'

export const ContractInformationHeader = ({
  organisation,
  repository,
  contractDeployment,
  assetDeployment,
}: {
  organisation: Organisation
  repository: Repository
  contractDeployment: ContractDeployment
  assetDeployment: AssetDeployment
}) => {
  return (
    <div className='flex flex-row items-center space-x-2'>
      <div className='flex space-x-1'>
        <h2 className='text-xs'>Address</h2>
        <h1 className='text-xs font-bold'>
          <LinkComponent
            target='_blank'
            rel='noopener noreferrer'
            href={routeBuilder(
              organisation?.name,
              repository?.name,
              ZoneNavigationEnum.enum.Explore,
              MintNavigationEnum.enum.Preview,
              contractDeployment?.address,
              MintNavigationEnum.enum.Mint
            )}
            underline
          >
            Click here
          </LinkComponent>
        </h1>
      </div>
      <div className='w-0.5 h-0.5 bg-darkGrey rounded-full' />
      <div className='flex space-x-1'>
        <h2 className='text-xs'>Chain</h2>
        <h1 className='text-xs font-bold'>{capitalize(parseChainId(contractDeployment?.chainId || 0))}</h1>
      </div>
      <div className='w-0.5 h-0.5 bg-darkGrey rounded-full' />
      <div className='flex space-x-1'>
        <h2 className='text-xs'>Branch</h2>
        <h1 className='text-xs font-bold'>{toPascalCaseWithSpace(assetDeployment?.branch || '')}</h1>
      </div>
      <div className='w-0.5 h-0.5 bg-darkGrey rounded-full' />
      <div className='flex space-x-1'>
        <h2 className='text-xs'>Type</h2>
        <h1 className='text-xs font-bold'>{toPascalCaseWithSpace(assetDeployment?.type || '')}</h1>
      </div>
    </div>
  )
}
