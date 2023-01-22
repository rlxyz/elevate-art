import type { ContractDeployment } from '@prisma/client'
import { getSyncedBaseURI } from 'src/client/utils/image'
import { useFetchContractBaseURI } from './useFetchContractBaseURI'

export const useBaseURISynced = ({ contractDeployment }: { contractDeployment: ContractDeployment }) => {
  const { data } = useFetchContractBaseURI({
    contractAddress: contractDeployment.address,
    chainId: contractDeployment.chainId,
    enabled: true,
    version: '1.0.0',
  })

  if (!data) return { synced: false }
  const { baseURI } = data
  return {
    synced:
      baseURI ===
      getSyncedBaseURI({
        contractDeployment,
      }),
  }
}
