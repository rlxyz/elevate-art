import Card from '@components/layout/card/Card'
import type { ContractDeployment } from '@prisma/client'
import { useBaseURISynced } from './useBaseURISynced'
import { useUpdateBaseURI } from './useUpdateBaseURI'

export const ContractSyncedView = ({ contractDeployment }: { contractDeployment: ContractDeployment }) => {
  const { synced } = useBaseURISynced({ contractDeployment })
  const { write, isLoading, isProcessing } = useUpdateBaseURI({
    contractDeployment,
    enabled: !synced,
  })

  if (synced)
    return (
      <Card className='w-72 border-blueHighlight'>
        <p className='text-xs'>
          Your contract is <strong>synced</strong> with the latest version of elevate.art.
        </p>
      </Card>
    )

  return (
    <Card className='w-72 border-redError'>
      <p className='text-xs'>
        The BaseURI is <strong>not synced</strong> with the latest version of elevate.art. If you do not update this, your NFTs will{' '}
        <strong>not be visible</strong>.
      </p>
      <button
        className='bg-redError text-white py-1 px-2 rounded-[3px] text-xs disabled:opacity-50 disabled:cursor-not-allowed'
        onClick={() => {
          write()
        }}
        disabled={isLoading || isProcessing}
      >
        Sync Now
      </button>
    </Card>
  )
}
