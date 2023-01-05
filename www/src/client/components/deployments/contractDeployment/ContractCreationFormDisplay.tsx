import useContractCreationStore from '@components/deployments/contractDeployment/useContractCreationStore'
import { CubeIcon } from '@heroicons/react/outline'
import clsx from 'clsx'
import type { FC } from 'react'
import { z } from 'zod'
import { ContractDetailsForm } from './ContactCreationForms/ContactDetailsForm'
import { ContractCompletionForm } from './ContactCreationForms/ContractCompletionForm'
import { MintDetailsForm } from './ContactCreationForms/MintDetailsForm'

interface ContractCreationSegmentProps {
  id: string
  title: string
  description: string
  component: FC<{ title: string; description: string }>
  icon: React.ReactNode
  motionX: number
  motionOpacity: number
}

export const ContractCreationEnum = z.nativeEnum(
  Object.freeze({
    ContractDetails: 'contract-detail',
    MintDetails: 'mint-details',
  })
)

export type ContractCreationType = z.infer<typeof ContractCreationEnum>
export const ContractCreationSegments: ContractCreationSegmentProps[] = [
  {
    id: 'contract-base-details',
    title: 'Smart Contract Details',
    description: 'These are important terms for your contract that you need to finalise before continuing!',
    component: ContractDetailsForm,
    motionX: 0.5,
    motionOpacity: 1,
    icon: <CubeIcon className='w-10 h-10 text-darkGrey' />,
  },
  {
    id: 'mint-details',
    title: 'Mint Details',
    description: 'Enter the details of your mint',
    motionX: 0.75,
    motionOpacity: 0.5,
    component: MintDetailsForm,
    icon: <CubeIcon className='w-10 h-10 text-darkGrey' />,
  },
  {
    id: 'contract-completion',
    title: 'Mint Revenue Splits',
    description: 'Enter the details of your mint',
    motionX: 1,
    motionOpacity: 0.25,
    component: ContractCompletionForm,
    icon: <CubeIcon className='w-10 h-10 text-darkGrey' />,
  },
]

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
