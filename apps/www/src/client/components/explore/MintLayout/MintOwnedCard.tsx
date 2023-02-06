import Card from '@components/layout/card/Card'
import { ExclamationCircleIcon } from '@heroicons/react/outline'
import type { ContractDeployment } from '@prisma/client'
import type { Session } from 'next-auth'
import { useFetchContractUserData } from '../SaleLayout/useFetchContractUserData'

export const MintOwnedCard = ({ contractDeployment, session }: { contractDeployment: ContractDeployment; session: Session }) => {
  const { data: userData } = useFetchContractUserData({
    version: '0.1.0',
    contractAddress: contractDeployment.address,
    chainId: contractDeployment.chainId,
    userAdress: session.user?.address,
  })
  if (!userData || userData.userMintCount.eq(0)) return null
  return (
    <Card className='text-xs border-blueHighlight text-blueHighlight'>
      <div className='flex space-x-2 items-center'>
        <ExclamationCircleIcon className='w-4 h-4 text-blueHighlight' />
        <span>
          You minted <strong>{userData.userMintCount.toString()} NFTs</strong> from this collection
        </span>
      </div>
    </Card>
  )
}
