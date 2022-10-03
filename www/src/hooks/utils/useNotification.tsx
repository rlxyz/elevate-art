import { Notification } from '@components/Layout/Notification'
import * as React from 'react'
import toast from 'react-hot-toast'

export const useNotification = () => {
  const notifySuccess = (message: React.ReactNode, type: 'clean' | 'advanced' = 'advanced') => {
    return toast.custom(
      (t) => (
        <Notification id={t.id} type='success'>
          <div className='flex justify-between w-full items-center'>
            <span className='pr-4'>{message}</span>
          </div>
        </Notification>
      ),
      {
        position: 'bottom-right',
        duration: 1000,
      }
    )
  }

  const notifyError = (message: string) => {
    return toast.custom(
      (t) => (
        <Notification id={t.id} type='error'>
          <div className='flex justify-between w-full items-center'>
            <div className='font-gilroy-light'>
              <div className='font-bold'>{message}</div>
            </div>
          </div>
        </Notification>
      ),
      {
        id: 'message-notification-error',
        position: 'bottom-right',
        duration: 2000,
      }
    )
  }

  return {
    notifySuccess,
    notifyError,
  }
}
