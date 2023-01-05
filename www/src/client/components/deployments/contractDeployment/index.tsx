import type { ContractCreationType, ContractFormProps } from '@components/deployments/contractDeployment/ContactCreationForm'
import { ContractCreationEnum, ContractCreationForm } from '@components/deployments/contractDeployment/ContactCreationForm'
import {
  ContractContext,
  createContractCreationStore,
} from '@components/deployments/contractDeployment/ContactCreationForm/useContractCreationStore'
import { TriangleIcon } from '@components/layout/icons/RectangleGroup'
import { CubeIcon, MoonIcon } from '@heroicons/react/outline'
import type { FC } from 'react'
import { ContractDetailsForm } from './ContactCreationForm/ContactDetailsForm'
import { ContractCompletionForm } from './ContactCreationForm/ContractCompletionForm'
import { MintDetailsForm } from './ContactCreationForm/MintDetailsForm'
import { ContractCreationHelperAnimation } from './ContractCreationAnimation'

export interface ContractCreationAnimationProps extends ContractCreationSegmentProps {
  icon: React.ReactNode // animation
  motionX: number // animation
  motionOpacity: number // animation
  transformInputRange: number[] // animation
  transformOutputRange: string[] // animation
}

export interface ContractCreationFormProps extends ContractCreationSegmentProps {
  title: string // form
  description: string // form
  component: FC<ContractFormProps> // form
}

export interface ContractCreationSegmentProps {
  index: number // animation
  id: ContractCreationType // form & animation
  previous: ContractCreationType | null // animation & form
  next: ContractCreationType | null // animation & form
}

export const ContractCreationSegments: (ContractCreationAnimationProps & ContractCreationFormProps)[] = [
  {
    index: 0,
    id: ContractCreationEnum.enum.ContractDetails,
    title: 'Smart Contract Details',
    description: 'These are important terms for your contract that you need to finalise before continuing!',
    component: ContractDetailsForm,
    motionX: 0.5,
    motionOpacity: 1,
    icon: <TriangleIcon className='w-10 h-10 text-darkGrey' />,
    previous: null,
    next: ContractCreationEnum.enum.MintDetails,
    transformOutputRange: ['15%', '32.5%', '50%'],
    transformInputRange: [0, 0.25, 0.5],
  },
  {
    index: 1,
    id: ContractCreationEnum.enum.MintDetails,
    title: 'Mint Details',
    description: 'Enter the details of your mint',
    motionX: 0.75,
    motionOpacity: 0.5,
    component: MintDetailsForm,
    icon: <CubeIcon className='w-10 h-10 text-darkGrey' />,
    previous: ContractCreationEnum.enum.ContractDetails,
    next: ContractCreationEnum.enum.ContractCompletion,
    transformOutputRange: ['32.5%', '50%', '67.5%'],
    transformInputRange: [0.25, 0.5, 0.75],
  },
  {
    index: 2,
    id: ContractCreationEnum.enum.ContractCompletion,
    title: 'Mint Revenue Splits',
    description: 'Enter the details of your mint',
    motionX: 1,
    motionOpacity: 0.25,
    component: ContractCompletionForm,
    icon: <MoonIcon className='w-10 h-10 text-darkGrey' />,
    previous: ContractCreationEnum.enum.MintDetails,
    next: null,
    transformOutputRange: ['50%', '67.5%', '85%'],
    transformInputRange: [0.5, 0.75, 1],
  },
]

export const ContractCreation = () => {
  return (
    <ContractContext.Provider createStore={() => createContractCreationStore}>
      <ContractCreationHelperAnimation contractCreationAnimation={ContractCreationSegments} className='py-16' />
      <ContractCreationForm contractCreationForm={ContractCreationSegments} className='h-[calc(100vh-17.75rem)] py-8' />
    </ContractContext.Provider>
  )
}
