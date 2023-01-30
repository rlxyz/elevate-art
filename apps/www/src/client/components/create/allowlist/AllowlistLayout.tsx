import { useFetchContractMerkleRootData } from '@components/explore/SaleLayout/useFetchContractMerkleRootData'
import type { ContractDeployment, ContractDeploymentAllowlist } from '@prisma/client'
import { ContractDeploymentAllowlistType } from '@prisma/client'
import { AllowlistLayoutHeader } from './AllowlistLayoutHeader'
import { AllowlistLayoutTable } from './AllowlistLayoutTable'
import { AllowlistLayoutTextarea } from './AllowlistLayoutTextarea'
import { useSetMerkleRoot } from './useSetPresaleMerkleRoot'

export type AllowlistFormInput = {
  address: `0x${string}`
  mint: number
}[]

export type AllowlistFormInputV2 = string

export const AllowlistLayout = ({
  contractDeployment,
  whitelist,
  type,
}: {
  contractDeployment: ContractDeployment
  whitelist: ContractDeploymentAllowlist[]
  type: ContractDeploymentAllowlistType
}) => {
  const {
    merkleRoot: dbMerkleRoot,
    write,
    isLoading,
    isProcessing,
  } = useSetMerkleRoot({
    type,
    contractDeployment: contractDeployment,
    enabled: !!contractDeployment?.address,
    whitelist: whitelist,
  })

  const { data } = useFetchContractMerkleRootData({
    contractAddress: contractDeployment?.address || '',
    chainId: contractDeployment?.chainId || 99,
    enabled: !!contractDeployment?.address,
    version: '0.1.0',
  })

  return (
    <>
      <div className='space-y-2'>
        <div className='w-full space-y-6'>
          <AllowlistLayoutHeader
            contractDeployment={contractDeployment}
            write={write}
            isLoading={isLoading || isProcessing}
            whitelist={[]}
            dbMerkleRoot={dbMerkleRoot}
            contractMerkleRoot={
              type === ContractDeploymentAllowlistType.PRESALE ? data?.presaleMerkleRoot || '' : data?.claimMerkleRoot || ''
            }
            type={type}
          />
          <AllowlistLayoutTextarea contractDeployment={contractDeployment} type={type} />
          <AllowlistLayoutTable contractDeployment={contractDeployment} whitelist={whitelist} />
        </div>
      </div>
    </>
  )
}
