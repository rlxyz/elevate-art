import useContractCreationStore from '@components/deployments/contractDeployment/useContractCreationStore'
import { CubeIcon } from '@heroicons/react/outline'
import clsx from 'clsx'
import type { FC } from 'react'
import { useEffect } from 'react'
import { z } from 'zod'
import { ContractDetailsForm } from './ContactCreationForms/ContactDetailsForm'
import { ContractCompletionForm } from './ContactCreationForms/ContractCompletionForm'
import { MintDetailsForm } from './ContactCreationForms/MintDetailsForm'

interface ContractCreationSegmentProps {
  id: ContractCreationType
  title: string
  description: string
  component: FC<ContractFormProps>
  icon: React.ReactNode
  motionX: number
  motionOpacity: number
  previous: ContractCreationType | null
  next: ContractCreationType | null
}

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
export const ContractCreationSegments: ContractCreationSegmentProps[] = [
  {
    id: ContractCreationEnum.enum.ContractDetails,
    title: 'Smart Contract Details',
    description: 'These are important terms for your contract that you need to finalise before continuing!',
    component: ContractDetailsForm,
    motionX: 0.5,
    motionOpacity: 1,
    icon: <CubeIcon className='w-10 h-10 text-darkGrey' />,
    previous: null,
    next: ContractCreationEnum.enum.MintDetails,
  },
  {
    id: ContractCreationEnum.enum.MintDetails,
    title: 'Mint Details',
    description: 'Enter the details of your mint',
    motionX: 0.75,
    motionOpacity: 0.5,
    component: MintDetailsForm,
    icon: <CubeIcon className='w-10 h-10 text-darkGrey' />,
    previous: ContractCreationEnum.enum.ContractDetails,
    next: ContractCreationEnum.enum.ContractCompletion,
  },
  {
    id: ContractCreationEnum.enum.ContractCompletion,
    title: 'Mint Revenue Splits',
    description: 'Enter the details of your mint',
    motionX: 1,
    motionOpacity: 0.25,
    component: ContractCompletionForm,
    icon: <CubeIcon className='w-10 h-10 text-darkGrey' />,
    previous: ContractCreationEnum.enum.MintDetails,
    next: null,
  },
]

export const ContractCreationFormDisplay: FC<{ className: string }> = ({ className }) => {
  const { currentSegment, setCurrentSegment } = useContractCreationStore()

  useEffect(() => {
    setCurrentSegment(ContractCreationEnum.enum.ContractDetails)
  }, [])

  return (
    <div className={clsx('flex flex-col items-center', className)}>
      {ContractCreationSegments.map((item) => (
        <div key={item.id} className={clsx(currentSegment !== item.id && 'hidden', 'flex space-y-9 w-3/4')}>
          <item.component description={item.description} title={item.title} previous={item.previous} next={item.next} />
        </div>
      ))}
    </div>
  )
}
