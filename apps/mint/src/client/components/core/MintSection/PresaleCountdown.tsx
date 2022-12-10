import { Disclosure } from '@headlessui/react'
import { ChevronRightIcon } from '@heroicons/react/outline'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useMintPeriod } from 'src/client/hooks/contractsRead'
import { formatTime, useCountDown } from 'src/client/hooks/useCountDown'

import type { ReactNode } from 'react'
import React from 'react'

interface Props {
  className?: string
}

const SaleLayoutContainer = ({ children }: { children: ReactNode }) => {
  return <div className='p-4'>{children}</div>
}

const defaultProps: Props = { className: '' }

export type SaleLayoutProps = Props & Omit<React.HTMLAttributes<any>, keyof Props>

export const SaleLayout: React.FC<React.PropsWithChildren<SaleLayoutProps>> = ({
  children,
  className,
  ...props
}: SaleLayoutProps & typeof defaultProps) => {
  const childrens = React.Children.toArray(children)

  return (
    <article
      className={clsx(
        className,
        'bg-background transition-all rounded-[5px] box-border border border-mediumGrey divide-y divide-mediumGrey'
      )}
      {...props}
    >
      {childrens.map((child, index) => {
        return <SaleLayoutContainer key={index}>{child}</SaleLayoutContainer>
      })}
      <SaleLayoutFooter />
    </article>
  )
}

export const SaleLayoutHeader = () => {
  const { presaleTime } = useMintPeriod()
  const presaleCountDown = useCountDown(dayjs.unix(presaleTime).toDate())

  const timer = `${formatTime(presaleCountDown[1])}:${formatTime(presaleCountDown[2])}:${formatTime(presaleCountDown[3])}`

  return (
    <div className='flex justify-between'>
      <h1 className='text-xs font-semibold'>Presale</h1>
      <div className='flex justify-between items-center space-x-2 text-xs'>
        <span>Countdown</span>
        <div className='w-0.5 h-0.5 bg-darkGrey rounded-full' />
        <p className='font-semibold'>{timer}</p>
      </div>
    </div>
  )
}

export const SaleLayoutBody = ({ children }: { children: ReactNode }) => {
  return <>{children}</>
}

export const SaleLayoutFooter = () => {
  return (
    <Disclosure>
      <Disclosure.Button className={clsx('border-mediumGrey border-b p-4 w-full')}>
        <div className='flex justify-end items-center space-x-2'>
          <h2 className='text-xs font-normal'>Details</h2>
          <div className='w-0.5 h-0.5 bg-darkGrey rounded-full' />
          <ChevronRightIcon className='w-3 h-3' />
        </div>
      </Disclosure.Button>
      <Disclosure.Panel className={clsx('p-4 transition-all')}>
        <div className='text-xs space-x-6 flex justify-between'>
          <p>Date {1}</p>
          <span className='font-semibold'>{new Date()?.toLocaleTimeString()}</span>
        </div>
      </Disclosure.Panel>
    </Disclosure>
  )
}
