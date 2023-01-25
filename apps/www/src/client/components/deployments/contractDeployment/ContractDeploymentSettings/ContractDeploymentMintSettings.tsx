import { useSetMintTime } from '@components/explore/SaleLayout/useSetMintTime'
import type { ContractDeployment } from '@prisma/client'
import { ContractDeploymentMintTimeForm } from './ContractDeploymentMintTimeForm'

export const ContractDeploymentMintSettings = ({
  isLoading,
  claimTime,
  presaleTime,
  publicTime,
  contractDeployment,
}: {
  isLoading: boolean
  claimTime: Date
  presaleTime: Date
  publicTime: Date
  contractDeployment: ContractDeployment
}) => {
  const {
    mintTime: currentClaimTime,
    setMintTime: setCurrentClaimTime,
    write: writeClaimTime,
  } = useSetMintTime({
    address: contractDeployment.address,
    contractDeployment,
    currentTime: claimTime,
    functionName: 'setClaimTime',
    enabled: !!contractDeployment?.address,
  })

  const {
    mintTime: currentPublicTime,
    setMintTime: setCurrentPublicTime,
    write: writePublicTime,
  } = useSetMintTime({
    address: contractDeployment.address,
    contractDeployment,
    currentTime: presaleTime,
    functionName: 'setPresaleTime',
    enabled: !!contractDeployment?.address,
  })

  const {
    mintTime: currentPresaleTime,
    setMintTime: setCurrentPresaleTime,
    write: writePresaleTime,
  } = useSetMintTime({
    address: contractDeployment.address,
    contractDeployment,
    currentTime: publicTime,
    functionName: 'setPublicTime',
    enabled: !!contractDeployment?.address,
  })

  return (
    <div className='space-y-6'>
      <ContractDeploymentMintTimeForm
        isLoading={isLoading}
        currentTime={currentClaimTime}
        label={'Claim Mint Time'}
        write={writeClaimTime}
        setClaimTime={setCurrentClaimTime}
      />
      <ContractDeploymentMintTimeForm
        isLoading={isLoading}
        currentTime={currentPublicTime}
        label={'Public Mint Time'}
        write={writePublicTime}
        setClaimTime={setCurrentPublicTime}
      />
      <ContractDeploymentMintTimeForm
        isLoading={isLoading}
        currentTime={currentPresaleTime}
        label={'Presale Mint Time'}
        write={writePresaleTime}
        setClaimTime={setCurrentPresaleTime}
      />
    </div>
  )
}
