import { ContractCreationSegments } from '@components/repository/RepsitoryContractDeployment/ContractCreationHelperAnimation'
import { useContractCreationStore } from '@hooks/utils/useContractCreationStore'
import clsx from 'clsx'
import type { FC } from 'react'

export const ContractCreationFormDisplay: FC<{ className: string }> = ({ className }) => {
  const { currentSegment } = useContractCreationStore()

  return (
    <div className={clsx('flex flex-col items-center', className)}>
      {ContractCreationSegments.map((item, index) => (
        <div key={item.id} className={clsx(currentSegment !== index && 'hidden', 'flex space-y-9 w-3/4')}>
          <item.component description={item.description} title={item.title} />
        </div>
      ))}
    </div>
  )
}
