import { ConnectButton as RbConnectButton } from '@rainbow-me/rainbowkit'
import React from 'react'

export const ConnectButton = () => {
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
                return (
                  <>
                    <button onClick={openConnectModal} type="button">
                      <span className="font-bold">Connect Wallet</span>
                    </button>
                    <span className="h-[12px] w-[12px] bg-redDot rounded-full inline-block ml-2"></span>
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
                <div className="flex items-center">
                  <button onClick={openAccountModal} type="button">
                    <span className="block font-light">Connected to:</span>
                    <span className="font-bold">{account.displayName}</span>
                  </button>
                  <span className="h-[12px] w-[12px] bg-greenDot rounded-full inline-block ml-2"></span>
                </div>
              )
            })()}
          </div>
        )
      }}
    </RbConnectButton.Custom>
  )
}
