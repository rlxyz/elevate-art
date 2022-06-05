import { Button } from '@components/Button'
import { ButtonLink } from '@components/ButtonLink'
import { Notification } from '@components/Notification'
import { NETWORK_NAME } from '@utils/constant'
import { rollbar } from '@utils/rollbar'
import * as React from 'react'
import toast from 'react-hot-toast'

export const useNotify = () => {
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
              <div className="font-gilroy-light">{message}</div>
            </div>
            <div>
              <Button
                onClick={() => {
                  toast.dismiss(t.id)
                }}
                className="py-2 px-4 text-sm bg-[#191b23] text-white"
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

  const notifySubmitted = (trxHash = '', duration = 8000) => {
    const networkId = process.env.NEXT_PUBLIC_NETWORK_ID
    const transactionEtherscanUrl =
      networkId === '1'
        ? `https://etherscan.io/tx/${trxHash}`
        : `https://${NETWORK_NAME[networkId]}.etherscan.io/tx/${trxHash}`
    return toast.custom(
      t => (
        <Notification id={t.id} type="success">
          <div className="flex justify-between w-full items-center">
            <div className="font-gilroy-light">
              <div className="font-bold mb-4">Transaction Submitted</div>
              <div>View on Etherscan</div>
            </div>
            <div>
              <ButtonLink
                href={transactionEtherscanUrl}
                className="py-2 px-16 text-base bg-[#191b23] text-white"
                label="View"
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

  const notifySuccess = () => {
    return toast.custom(
      t => (
        <Notification id={t.id} type="success">
          <div className="flex justify-between w-full items-center">
            <div className="font-gilroy-light">
              <div className="font-bold mb-4">
                {`You've successfully minted a Reflections piece, we're dreaming it up now!`}
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
