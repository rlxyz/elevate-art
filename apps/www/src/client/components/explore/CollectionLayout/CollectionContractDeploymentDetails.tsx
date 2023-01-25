import { DescriptionWithDisclouser } from '@components/layout/DescriptionWithDisclouser'
import type { AssetDeployment, ContractDeployment, Organisation, Repository } from '@prisma/client'
import type { RhapsodyContractData } from '@utils/contracts/ContractData'
import { parseChainId } from '@utils/ethers'
import { formatUnits } from 'ethers/lib/utils.js'
import { capitalize, toPascalCaseWithSpace } from 'src/client/utils/format'

interface CollectionContractDeploymentDetailsProps {
  repository: Repository | null | undefined
  organisation: Organisation | null | undefined
  deployment: AssetDeployment | null | undefined
  contractDeployment: ContractDeployment | null | undefined
  contractData: RhapsodyContractData | null | undefined
}
export const CollectionContractDeploymentDetails: React.FC<CollectionContractDeploymentDetailsProps> = ({
  repository,
  organisation,
  deployment,
  contractDeployment,
  contractData,
}) => (
  <div className='flex flex-col space-y-3 w-full md:w-1/2'>
    <div className='flex'>
      <h1 className='text-2xl font-bold'>{repository?.displayName || repository?.name || '...'}</h1>
    </div>
    <div className='flex space-x-1'>
      <h2 className='text-xs'>By</h2>
      <h1 className='text-xs font-bold'>{organisation?.name}</h1>
    </div>
    <div className='flex flex-row items-center space-x-2'>
      <div className='flex space-x-1'>
        <h2 className='text-xs'>Total</h2>
        <h1 className='text-xs font-bold'>{deployment?.totalSupply}</h1>
      </div>
      <div className='w-0.5 h-0.5 bg-darkGrey rounded-full' />
      <div className='flex space-x-1'>
        <h2 className='text-xs'>Minted</h2>
        <h1 className='text-xs font-bold'>{contractData?.totalSupply && formatUnits(contractData.totalSupply, 0)}</h1>
      </div>
      <div className='w-0.5 h-0.5 bg-darkGrey rounded-full' />
      <div className='flex space-x-1'>
        <h2 className='text-xs'>Chain</h2>
        <h1 className='text-xs font-bold'>{contractDeployment?.chainId && capitalize(parseChainId(contractDeployment.chainId))}</h1>
      </div>
      <div className='w-0.5 h-0.5 bg-darkGrey rounded-full' />
      <div className='flex space-x-1'>
        <h2 className='text-xs'>Type</h2>
        <h1 className='text-xs font-bold'>{deployment?.type && toPascalCaseWithSpace(deployment.type)}</h1>
      </div>
      <div className='w-0.5 h-0.5 bg-darkGrey rounded-full' />
      <div className='flex space-x-1'>
        <h2 className='text-xs overflow-hidden text-ellipsis whitespace-nowrap'>Max Mint Per Address</h2>
        <h1 className='text-xs font-bold'>
          {contractData?.publicPeriod.maxMintPerAddress && <span>{formatUnits(contractData?.publicPeriod.maxMintPerAddress, 0)}</span>}
        </h1>
      </div>
    </div>
    {repository?.description && <DescriptionWithDisclouser description={repository.description} />}
  </div>
)
