import { ComponentMeta } from '@storybook/react'
import React from 'react'
import { Toaster } from 'react-hot-toast'
import { useNotification } from 'src/client/hooks/useNotification'

import { Button } from '../UI/Button'
import { Notification } from './Notification'

export default {
  title: 'Notification',
  component: Notification,
} as ComponentMeta<typeof Notification>

const Wrapper: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}

export const TransactionSubmitted = () => {
  return (
    <Notification id='basic-notification' type='error'>
      <div className='flex justify-between w-full items-center'>
        <div>
          <h3 className='font-bold text-lg'>Transaction Submitted</h3>
          <span className='block'>View on etherscan</span>
        </div>
        <div>
          <Button>View</Button>
        </div>
      </div>
    </Notification>
  )
}

export const WithToasterMintSucceed = () => {
  const { notifySuccess } = useNotification('RLXYZ Studio')
  return (
    <Wrapper>
      <Button onClick={() => notifySuccess()}>Show notification</Button>
    </Wrapper>
  )
}

export const WithToasterTransactionSubmmited = () => {
  const { notifySubmitted } = useNotification('RLXYZ Studio')
  return (
    <Wrapper>
      <Button onClick={() => notifySubmitted('02x')}>Show notification</Button>
    </Wrapper>
  )
}
