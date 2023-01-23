import NextLinkComponent from '@components/layout/link/NextLink'
import type { AssetDeployment, Organisation, Repository } from '@prisma/client'
import { clsx, routeBuilder } from 'src/client/utils/format'
import { AssetDeploymentNavigationEnum, ContractDeploymentNavigationEnum, ZoneNavigationEnum } from 'src/shared/enums'

export const ContractNotDeployedView = ({
  deployment,
  organisation,
  repository,
}: {
  deployment: AssetDeployment
  organisation: Organisation
  repository: Repository
}) => {
  return (
    <div className={clsx('py-8 flex items-center justify-between')}>
      <div className='space-y-2'>
        <div>
          <h1 className='text-2xl font-semibold'>Contract</h1>
          <p className='text-sm'>You are viewing the contract information for this deployment</p>
        </div>
        <div className='text-xs'>
          This contract <strong>has not</strong> been deployed
        </div>
      </div>
      <div>
        <NextLinkComponent
          href={routeBuilder(
            organisation?.name,
            repository?.name,
            ZoneNavigationEnum.enum.Deployments,
            deployment?.name,
            AssetDeploymentNavigationEnum.enum.Contract,
            ContractDeploymentNavigationEnum.enum.New
          )}
          className='border p-2 border-mediumGrey rounded-[5px] bg-blueHighlight text-white text-xs disabled:bg-lightGray disabled:cursor-not-allowed disabled:text-darkGrey'
        >
          Deploy a Contract
        </NextLinkComponent>
      </div>
    </div>
  )
}
