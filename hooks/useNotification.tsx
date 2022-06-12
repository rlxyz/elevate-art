import { Notification } from '@components/Notification/Notification'
import { Button } from '@components/UI/Button'
import { config } from '@utils/config'
import * as React from 'react'
import toast from 'react-hot-toast'

import { useStore } from './useStore'

export const useNotification = () => {
  const { rollbar } = useStore()

  const notifyError = ({
    message = '',
    duration = 10000,
    err,
  }: {
    message: string
    duration?: number
    err?: Error
  }) => {
    if (err) {
      rollbar.error(err)
    }

    return toast.custom(
      t => (
        <Notification id={t.id} type="error">
          <div className="flex justify-between w-full items-center">
            <div>
              <h3 className="font-bold text-lg">Error</h3>
              <span className="block">{message}</span>
            </div>
            <div>
              <Button
                onClick={() => {
                  toast.dismiss(t.id)
                }}
                label="Close"
              />
            </div>
          </div>
        </Notification>
      ),
      {
        id: 'message-notification',
        position: 'bottom-right',
        duration: duration,
      },
    )
  }

  const notifySubmitted = (duration = 8000) => {
    return toast.custom(
      t => (
        <Notification id={t.id} type="success">
          <div className="flex justify-between w-full items-center">
            <div className="font-gilroy-light">
              <div className="font-bold mb-4">Transaction Submitted</div>
              <span className="block">View on Etherscan</span>
            </div>
            <div>
              <Button label="View" />
            </div>
          </div>
        </Notification>
      ),
      {
        id: 'message-notification',
        position: 'bottom-right',
        duration: duration,
      },
    )
  }

  const notifySuccess = () => {
    return toast.custom(
      t => (
        <Notification id={t.id} type="success">
          <div className="flex justify-between w-full items-center">
            <div className="font-gilroy-light">
              <div className="font-bold mb-4">
                {`You've successfully minted a ${config.projectName} piece`}
              </div>
            </div>
          </div>
        </Notification>
      ),
      {
        id: 'message-notification-success',
        position: 'bottom-right',
        duration: 2000,
      },
    )
  }

  return {
    notifySubmitted,
    notifySuccess,
    notifyError,
  }
}
