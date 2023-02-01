import type { AssetDeployment, ContractDeployment, Organisation, Repository } from '@prisma/client'
import { clsx } from 'src/client/utils/format'
import { ContractSyncedView } from './BaseURISyncButton'
import { ContractInformationHeader } from './ContractInformationHeader'

export const ContractDeployedView = ({
  assetDeployment,
  contractDeployment,
  organisation,
  repository,
}: {
  assetDeployment: AssetDeployment
  contractDeployment: ContractDeployment
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
        <ContractInformationHeader
          contractDeployment={contractDeployment}
          organisation={organisation}
          repository={repository}
          assetDeployment={assetDeployment}
        />
      </div>
      <ContractSyncedView contractDeployment={contractDeployment} />
    </div>
  )
}
