import { Disclosure } from '@headlessui/react'
import { CheckCircleIcon, ChevronRightIcon, XCircleIcon } from '@heroicons/react/solid'
import type { ContractDeployment } from '@prisma/client'
import clsx from 'clsx'
import type { FC } from 'react'

const ContractDeploymentPhasesView: FC<{ deployment: ContractDeployment | null | undefined }> = ({ deployment }) => {
  /** Infer status as PENDING. */
  const status = deployment?.status || 'PENDING'
  return (
    <div className='space-y-6'>
      <h1 className='text-xl font-bold'>Deployment Status</h1>
      <div>
        <div>
          {['Deploying', 'Verification'].map((phase, index) => (
            <Disclosure key={phase}>
              <Disclosure.Button
                className={clsx(
                  'border-l border-r border-mediumGrey border-b p-5 w-full',
                  index === 0 && 'rounded-tl-[5px] rounded-tr-[5px] border-t',
                  index === 2 - 1 && 'rounded-bl-[5px] rounded-br-[5px]'
                )}
              >
                <div className='flex justify-between'>
                  <div className='flex items-center space-x-1'>
                    <ChevronRightIcon className='w-4 h-4' />
                    <h2 className='text-sm font-semibold'>{phase}</h2>
                  </div>

                  <div className='flex'>
                    {status === 'FAILED' ? (
                      <XCircleIcon className='w-5 h-5 text-redError' />
                    ) : (
                      <>
                        {status === 'PENDING' && <div className='w-5 h-5 border border-mediumGrey rounded-full' />}
                        {status === 'VERIFYING' && phase === 'Verification' && <CheckCircleIcon className='w-5 h-5 text-blueHighlight' />}
                        {status === 'DEPLOYED' && <CheckCircleIcon className='w-5 h-5 text-blueHighlight' />}
                      </>
                    )}
                  </div>
                </div>
              </Disclosure.Button>
              <Disclosure.Panel className={clsx('border-l border-r border-b border-mediumGrey p-5')}>
                <div className='text-xs space-x-6 flex'>
                  <span className='font-semibold'>{deployment?.createdAt.toLocaleTimeString()}</span>
                  <p>Address {deployment?.address}</p>
                </div>
              </Disclosure.Panel>
            </Disclosure>
          ))}
        </div>
      </div>
    </div>
  )
}
