import { RepositoryDescriptionWithDisclouser } from '@components/layout/DescriptionWithDisclouser'
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
  <div className='space-y-6 w-full'>
    {repository && <RepositoryDescriptionWithDisclouser repository={repository} organisation={organisation} />}
    {/* <div className='flex flex-col space-y-3 border border-mediumGrey rounded-[5px] w-full p-2'> */}
    <div className='grid grid-cols-3 gap-1 border border-mediumGrey rounded-[5px] p-2 xl:flex xl:border-none xl:gap-0 xl:flex-row xl:space-x-3 xl:items-center'>
      <div className='col-span-1 flex space-x-1'>
        <div className='flex space-x-1'>
          <h2 className='text-xs'>Total</h2>
          <h1 className='text-xs font-bold'>{deployment?.totalSupply}</h1>
        </div>
      </div>
      <div className='col-span-1 flex space-x-0 items-center xl:space-x-3'>
        <div className='w-0.5 h-0.5 bg-darkGrey rounded-full hidden xl:block' />
        <div className='flex space-x-1'>
          <h2 className='text-xs'>Minted</h2>
          <h1 className='text-xs font-bold'>{contractData?.totalSupply && formatUnits(contractData.totalSupply, 0)}</h1>
        </div>
      </div>
      <div className='col-span-1 flex space-x-0 items-center xl:space-x-3'>
        <div className='w-0.5 h-0.5 bg-darkGrey rounded-full hidden xl:block' />
        <div className='flex space-x-1'>
          <h2 className='text-xs'>Chain</h2>
          <h1 className='text-xs font-bold'>{contractDeployment?.chainId && capitalize(parseChainId(contractDeployment.chainId))}</h1>
        </div>
      </div>
      <div className='col-span-1 flex space-x-0 items-center xl:space-x-3'>
        <div className='w-0.5 h-0.5 bg-darkGrey rounded-full hidden xl:block' />
        <div className='flex space-x-1'>
          <h2 className='text-xs'>Type</h2>
          <h1 className='text-xs font-bold'>{deployment?.type && toPascalCaseWithSpace(deployment.type)}</h1>
        </div>
      </div>
      <div className='col-span-1 flex space-x-0 items-center xl:space-x-3'>
        <div className='w-0.5 h-0.5 bg-darkGrey rounded-full hidden xl:block' />
        <div className='flex space-x-1'>
          <h2 className='text-xs overflow-hidden text-ellipsis whitespace-nowrap'>Max Mint Per Address</h2>
          <h1 className='text-xs font-bold'>
            {contractData?.publicPeriod.maxMintPerAddress && <span>{formatUnits(contractData?.publicPeriod.maxMintPerAddress, 0)}</span>}
          </h1>
        </div>
      </div>
    </div>
    {/* </div> */}
  </div>
)
