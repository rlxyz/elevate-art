import { useFetchContractData } from '@components/explore/SaleLayout/useFetchContractData'
import type { ContractDeployment, Whitelist } from '@prisma/client'
import { WhitelistType } from '@prisma/client'
import { AllowlistLayoutHeader } from './AllowlistLayoutHeader'
import { AllowlistLayoutTable } from './AllowlistLayoutTable'
import { AllowlistLayoutTextarea } from './AllowlistLayoutTextarea'
<<<<<<< HEAD
import { useSetMerkleRoot } from './useSetPresaleMerkleRoot'
=======
import { useSetMerkleRootData } from './useSetMerkleRoot'
>>>>>>> 7e03caa5f97051f89396f24034090738f242deb8

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
  whitelist: Whitelist[]
  type: WhitelistType
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

  const { data } = useFetchContractData({
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
            contractMerkleRoot={type === WhitelistType.ALLOWLIST ? data?.presaleMerkleRoot || '' : data?.claimMerkleRoot || ''}
            type={type}
          />
          <AllowlistLayoutTextarea contractDeployment={contractDeployment} type={type} />
          <AllowlistLayoutTable contractDeployment={contractDeployment} whitelist={whitelist} />
        </div>
      </div>
    </>
  )
}
