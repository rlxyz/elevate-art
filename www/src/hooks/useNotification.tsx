import { Notification } from '@components/Layout/Notification'
import * as React from 'react'
import toast from 'react-hot-toast'

export const useNotification = () => {
  const notifySuccess = (message: React.ReactNode, type: string) => {
    return toast.custom(
      (t) => (
        <Notification id={t.id} type='success'>
          <div className='flex justify-between w-full items-center'>
            <span className='pr-4'>{message}</span>
            <span className='font-semibold text-darkGrey uppercase text-xs'>{type}</span>
          </div>
        </Notification>
      ),
      {
        id: 'message-notification-success',
        position: 'bottom-right',
        duration: 2000,
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
