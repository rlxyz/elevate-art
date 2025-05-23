import Card from '@components/layout/card/Card'
import { ExclamationCircleIcon } from '@heroicons/react/outline'
import type { ContractDeployment, ContractDeploymentAllowlistType } from '@prisma/client'
import { useFetchContractMerkleRootData } from '../SaleLayout/useFetchContractMerkleRootData'
import { useUserMerkleProof } from '../SaleLayout/useUserMerkleProof'

export const MintSyncedCard = ({
  contractDeployment,
  allowlistType,
}: {
  contractDeployment: ContractDeployment
  allowlistType: ContractDeploymentAllowlistType
}) => {
  const { root } = useUserMerkleProof({ type: allowlistType })
  const { data: merkleRootData } = useFetchContractMerkleRootData({
    version: '0.1.0',
    contractAddress: contractDeployment.address,
    chainId: contractDeployment.chainId,
  })
  if (!merkleRootData || !root || root === merkleRootData.claimMerkleRoot) return null
  return (
    <Card className='text-xs border-redError text-redError'>
      <div className='flex space-x-2 items-center'>
        <ExclamationCircleIcon className='w-4 h-4 text-redError' />
        <span>The owner of the contract has paused the mint. The mint will resume shortly.</span>
      </div>
    </Card>
  )
}
