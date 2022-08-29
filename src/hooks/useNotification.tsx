import { Notification } from '@components/Notification/Notification'
import * as React from 'react'
import toast from 'react-hot-toast'

export const useNotification = () => {
  const notifySuccess = (message: string) => {
    return toast.custom(
      (t) => (
        <Notification id={t.id} type='success'>
          <div className='flex justify-between w-full items-center'>
            <div className='font-gilroy-light'>
              <div className='font-bold'>{message}</div>
            </div>
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
