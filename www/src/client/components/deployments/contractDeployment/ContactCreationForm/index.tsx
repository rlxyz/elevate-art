import useContractCreationStore from '@components/deployments/contractDeployment/ContactCreationForm/useContractCreationStore'
import clsx from 'clsx'
import type { FC } from 'react'
import { useEffect } from 'react'
import { z } from 'zod'
import type { ContractCreationFormProps } from '..'

export type ContractFormProps = {
  title: string
  description: string
  previous: ContractCreationType | null
  next: ContractCreationType | null
}

export const ContractCreationEnum = z.nativeEnum(
  Object.freeze({
    ContractDetails: 'contract-detail',
    MintDetails: 'mint-details',
    ContractCompletion: 'contract-completion',
  })
)

export type ContractCreationType = z.infer<typeof ContractCreationEnum>

export const ContractCreationForm: FC<{ className: string; contractCreationForm: ContractCreationFormProps[] }> = ({
  className,
  contractCreationForm,
}) => {
  const { currentSegment, setCurrentSegment } = useContractCreationStore()

  useEffect(() => {
    setCurrentSegment(ContractCreationEnum.enum.ContractDetails)
  }, [])

  return (
    <div className={clsx('flex flex-col items-center', className)}>
      {contractCreationForm.map((item) => (
        <div key={item.id} className={clsx(currentSegment !== item.id && 'hidden', 'flex space-y-9 w-3/4')}>
          <item.component description={item.description} title={item.title} previous={item.previous} next={item.next} />
        </div>
      ))}
    </div>
  )
}
