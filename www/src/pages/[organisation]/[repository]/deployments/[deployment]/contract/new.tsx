import { PageRoutesNavbar } from '@components/layout/header/PageRoutesNavbar'
import withOrganisationStore from '@components/withOrganisationStore'
import { CubeIcon } from '@heroicons/react/outline'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import { useRepositoryRoute } from '@hooks/utils/useRepositoryRoute'
import clsx from 'clsx'
import type { MotionValue } from 'framer-motion'
import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Layout } from 'src/client/components/layout/core/Layout'
import { OrganisationAuthLayout } from 'src/client/components/organisation/OrganisationAuthLayout'
import { capitalize } from 'src/client/utils/format'
import { CollectionNavigationEnum, DeploymentNavigationEnum } from 'src/shared/enums'
import { z } from 'zod'
import create from 'zustand'

const useContractCreationStore = create<{
  currentSegment: number
  setCurrentSegment: (segment: number) => void
}>((set) => ({
  currentSegment: 0,
  setCurrentSegment: (segment: number) => set({ currentSegment: segment }),
}))

const SmartContactDetailsForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<any>({
    defaultValues: {
      name: '',
    },
  })

  return (
    <>
      <div className='flex flex-col items-center'>
        <h1 className='font-semibold'>Smart Contract Details</h1>
        <p className='text-xs'>These are important terms for your contract that you need to finalise before continuing!</p>
      </div>
      <div className='flex flex-col h-96 w-1/2'>
        <div className='grid grid-cols-6 gap-x-3 gap-y-3'>
          <div className='col-span-4 space-y-1 w-full'>
            <label className='text-xs font-semibold'>Contract Name</label>
            <input
              className={clsx('border border-mediumGrey block text-xs w-full pl-2 rounded-[5px] py-2')}
              type='string'
              {...register('name', {
                required: true,
                maxLength: 20,
                minLength: 3,
                pattern: /^[-/a-z0-9 ]+$/gi,
              })}
            />
            <p className='text-[0.6rem] text-darkGrey'>Your contract name on websites like Etherscan</p>
            {errors.name && (
              <span className='text-xs text-redError'>
                {errors.name.type === 'required'
                  ? 'This field is required'
                  : errors.name.type === 'pattern'
                  ? 'We only accept - and / for special characters'
                  : errors.name.type === 'validate'
                  ? 'A layer with this name already exists'
                  : 'Must be between 3 and 20 characters long'}
              </span>
            )}
          </div>

          <div className='col-span-2 space-y-1 w-full'>
            <label className='text-xs font-semibold'>Token Symbol</label>
            <input
              className={clsx('border border-mediumGrey block text-xs w-full pl-2 rounded-[5px] py-2')}
              type='string'
              {...register('symbol', {
                required: true,
                maxLength: 6,
                minLength: 3,
                pattern: /^[-/a-z]+$/gi,
                // validate: (value) => !layers.map((x) => x.name).includes(value),
              })}
            />
            <p className='text-[0.6rem] text-darkGrey'>The name of the token on Etherscan</p>
            {errors.name && (
              <span className='text-xs text-redError'>
                {errors.name.type === 'required'
                  ? 'This field is required'
                  : errors.name.type === 'pattern'
                  ? 'We only accept - and / for special characters'
                  : errors.name.type === 'validate'
                  ? 'A layer with this name already exists'
                  : 'Must be between 3 and 20 characters long'}
              </span>
            )}
          </div>

          <div className='col-span-6 space-y-1 w-full'>
            <label className='text-xs font-semibold'>Mint Type</label>
            <div className='flex space-x-6'>
              <div className='flex items-center space-x-3 py-2'>
                <input
                  type='radio'
                  value='off-chain'
                  className={clsx('border border-mediumGrey w-4 h-4 flex items-center text-xs')}
                  {...register('mint-type', {})}
                />
                <label className='text-xs'>Off-Chain Mint</label>
              </div>
              <div className='flex items-center space-x-3'>
                <input
                  type='radio'
                  disabled
                  value='on-chain'
                  className={clsx('border border-mediumGrey w-4 h-4 flex items-center text-xs disabled:cursor-not-allowed')}
                  {...register('mint-type', {})}
                />
                <label className='text-xs'>On-Chain Mint</label>
                <span className='inline-flex items-center rounded-full bg-lightGray bg-opacity-40 border border-mediumGrey py-1 px-2 lg:text-xs text-[0.6rem] font-medium text-black'>
                  <span className='text-darkGrey text-[0.6rem]'>Soon</span>
                </span>
              </div>
            </div>
          </div>

          <div className='col-span-6 space-y-1 w-full'>
            <label className='text-xs font-semibold'>Blockchain</label>
            <select {...register('role', { required: true })} className='text-xs block w-full rounded-[5px] border border-mediumGrey'>
              <option value={'ethereum'}>{capitalize('Ethereum')}</option>
            </select>
            <p className='text-[0.6rem] text-darkGrey'>Select a deployment blockchain</p>
          </div>
        </div>
      </div>
    </>
  )
}

const MintDetailsForm = () => {
  return <>Mint Details Form</>
}

const list = {
  visible: { opacity: 1 },
  hidden: { opacity: 0, x: 0 },
}

type CarouselSegmentProps = {
  transformOutputRange: string[]
  transformInputRange: number[]
  children: React.ReactNode
  index: number
  onClick: (index: number) => void
  x: MotionValue<number>
}

const CarouselSegment = ({ transformOutputRange, transformInputRange, children, index, onClick, x }: CarouselSegmentProps) => {
  const left = useTransform(x, transformInputRange, transformOutputRange)
  return (
    <motion.button
      style={{ left }}
      onClick={() => {
        onClick(index)
      }}
      className={clsx('absolute rounded-full -translate-x-1/2 border-4 border-white bg-lightGray transition-all duration-300 z-1 scale-75')}
    >
      <div className='rounded-full border p-2 transition-all duration-300 border-mediumGrey'>
        <div className='h-12 w-12 rounded-full  flex items-center justify-center'>{children}</div>
      </div>
    </motion.button>
  )
}

interface ContractCreationSegmentProps {
  id: string
  title: string
  description: string
  component: () => React.ReactElement
  icon: React.ReactNode
}

export const ContractCreationEnum = z.nativeEnum(
  Object.freeze({
    ContractDetails: 'contract-detail',
    MintDetails: 'mint-details',
  })
)

export type ContractCreationType = z.infer<typeof ContractCreationEnum>

const ContractCreationSegments: ContractCreationSegmentProps[] = [
  {
    id: 'contract-base-details',
    title: 'Smart Contract Details',
    description: 'Enter the details of your smart contract',
    component: SmartContactDetailsForm,
    icon: <CubeIcon className='w-10 h-10 text-darkGrey' />,
  },
  {
    id: 'mint-details',
    title: 'Mint Details',
    description: 'Enter the details of your mint',
    component: MintDetailsForm,
    icon: <CubeIcon className='w-10 h-10 text-darkGrey' />,
  },
]

const ContractCreationHelperAnimation = () => {
  const x = useMotionValue(0.5)
  const y = useMotionValue(0.75)
  const z = useMotionValue(1)
  const { currentSegment, setCurrentSegment } = useContractCreationStore()

  const handleClick = (index: number) => {
    if (currentSegment === index) return null
    setCurrentSegment(index)

    if (index === 0) {
      x.set(0.5)
      y.set(0.75)
      z.set(1)
    } else if (index === 1) {
      x.set(0.25)
      y.set(0.5)
      z.set(0.75)
    } else if (index === 2) {
      x.set(0.0)
      y.set(0.25)
      z.set(0.5)
    }
  }

  return (
    <motion.div initial='hidden' animate='visible' variants={list} className='flex h-full flex-col items-center w-full space-y-9'>
      <div className='relative grid grid-flow-col justify-items-center gap-2 pt-2'>
        <button className='h-1.5 w-1.5 bg-mediumGrey rounded-full transition-all duration-300 !bg-black' />
        <button className='h-1.5 w-1.5 bg-mediumGrey rounded-full' />
        <button className='h-1.5 w-1.5 bg-mediumGrey rounded-full' />
      </div>
      <div className='relative my-2 flex h-20 w-full items-center overflow-x-hidden rounded-[5px]'>
        <AnimatePresence>
          <CarouselSegment
            transformOutputRange={['0%', '25%', '50%']}
            transformInputRange={[0, 0.25, 0.5]}
            index={0}
            onClick={handleClick}
            x={x}
          >
            <CubeIcon className='w-10 h-10 text-darkGrey' />
          </CarouselSegment>
          <CarouselSegment
            transformOutputRange={['25%', '50%', '75%']}
            transformInputRange={[0.25, 0.5, 0.75]}
            index={1}
            onClick={handleClick}
            x={y}
          >
            <CubeIcon className='w-10 h-10 text-darkGrey' />
          </CarouselSegment>
          <CarouselSegment
            transformOutputRange={['50%', '75%', '100%']}
            transformInputRange={[0.5, 0.75, 1]}
            index={2}
            onClick={handleClick}
            x={z}
          >
            <CubeIcon className='w-10 h-10 text-darkGrey' />
          </CarouselSegment>
        </AnimatePresence>
        <div className='relative h-[1px] flex-1 bg-gradient-to-r from-mediumGrey via-blueHighlight to-mediumGrey z-[-1]' />
      </div>
    </motion.div>
  )
}

const Page = () => {
  // const { all: contractDeployment } = useQueryRepositoryContractDeployment()
  const { all: organisations } = useQueryOrganisationFindAll()
  const { mainRepositoryHref, repositoryName, organisationName, deploymentName } = useRepositoryRoute()
  const { currentSegment } = useContractCreationStore()

  return (
    <OrganisationAuthLayout>
      <Layout>
        <Layout.Header
          internalRoutes={[
            { current: organisationName, href: `/${organisationName}`, organisations },
            { current: repositoryName, href: `/${organisationName}/${repositoryName}` },
            { current: deploymentName, href: `/${organisationName}/${repositoryName}/deployments/${deploymentName}` },
          ]}
        >
          <PageRoutesNavbar>
            {[
              {
                name: DeploymentNavigationEnum.enum.Overview,
                href: `/${mainRepositoryHref}/${CollectionNavigationEnum.enum.Deployments}/${deploymentName}`,
                enabled: false,
                loading: false,
              },
              {
                name: DeploymentNavigationEnum.enum.Contract,
                href: `/${mainRepositoryHref}/${CollectionNavigationEnum.enum.Deployments}/${deploymentName}/contract`,
                enabled: true,
                loading: false,
              },
            ].map((item) => (
              <PageRoutesNavbar.Item key={item.name} opts={item} />
            ))}
          </PageRoutesNavbar>
        </Layout.Header>
        <Layout.Body border='none'>
          <div className='min-h-[calc(100vh-9.14rem)] flex flex-col my-16'>
            <div className='flex h-full flex-col items-center w-full space-y-9'>
              <ContractCreationHelperAnimation />
              {ContractCreationSegments.map(({ id, component }, index) => (
                <div key={id} className={(clsx(index !== currentSegment && 'hidden'), 'w-full flex flex-col items-center space-y-9')}>
                  {component()}
                </div>
              ))}
            </div>
          </div>
        </Layout.Body>
      </Layout>
    </OrganisationAuthLayout>
  )
}

export default withOrganisationStore(Page)
