import { Notification } from '@components/Notification/Notification'
import { Button } from '@components/UI/Button'
import * as React from 'react'
import toast from 'react-hot-toast'

export const useNotification = (collectionName: string) => {
  const notifySuccess = () => {
    return toast.custom(
      (t) => (
        <Notification id={t.id} type='success'>
          <div className='flex justify-between w-full items-center'>
            <div className='font-gilroy-light'>
              <div className='font-bold mb-4'>{`Regenerating ${collectionName} collection`}</div>
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

  return {
    notifySuccess,
  }
}
