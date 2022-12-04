import { Button } from '@Components/UI/Button'
import { ConnectButton as RbConnectButton } from '@rainbow-me/rainbowkit'
import React from 'react'

interface ConnectButtonProps {
  normalButton?: boolean
}

export const ConnectButton: React.FC<ConnectButtonProps> = ({ normalButton }) => {
  return (
    <RbConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        return (
          <div
            {...(!mounted && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!mounted || !account || !chain) {
                if (normalButton) {
                  return (
                    <div className="flex justify-center">
                      <Button onClick={openConnectModal}>Connect Wallet</Button>
                    </div>
                  )
                }
                return (
                  <>
                    <button onClick={openConnectModal} type="button">
                      <img src="/images/wallet.svg" className="w-7 h-7" alt="Wallet" />
                    </button>
                  </>
                )
              }

              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button">
                    Wrong network
                  </button>
                )
              }

              return (
                <button
                  onClick={openAccountModal}
                  type="button"
                  className="flex items-center"
                >
                  <span className="font-bold mr-3">{account.displayName}</span>
                  <img
                    src="/images/gray-wallet.svg"
                    className="w-7 h-7 inline-block"
                    alt="Wallet"
                  />
                </button>
              )
            })()}
          </div>
        )
      }}
    </RbConnectButton.Custom>
  )
}
