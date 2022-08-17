import { Notification } from '@components/Notification/Notification'
import * as React from 'react'
import toast from 'react-hot-toast'

export const useNotification = (projectName: string) => {
  const notifySuccess = () => {
    console.log('notifySuccess')
    return toast.custom(
      (t) => (
        <Notification id={t.id} type='success'>
          <div className='flex justify-between w-full items-center'>
            <div className='font-gilroy-light'>
              <div className='font-bold mb-4'>{`Generate successful`}</div>
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
