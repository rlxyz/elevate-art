// import Button from '@components/UI/Button'
// import { ConnectButton as RbConnectButton } from '@rainbow-me/rainbowkit'
// import React from 'react'

interface ConnectButtonProps {
  normalButton?: boolean
  disabled?: boolean
}

export const ConnectButton: React.FC<ConnectButtonProps> = ({ normalButton, disabled = false }) => {
  return (
    <RbConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
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
                    <div className='flex justify-center'>
                      <Button disabled onClick={openConnectModal}>
                        Connect Wallet
                      </Button>
                    </div>
                  )
                }
                return (
                  <>
                    <button disabled={disabled} onClick={openConnectModal} type='button'>
                      <img
                        src='/images/lightGray-wallet.svg'
                        className='w-8 h-8 p-2 inline-block border rounded border-lightGray'
                        alt='Wallet'
                      />
                    </button>
                  </>
                )
              }

              if (chain.unsupported) {
                return (
                  <button disabled={disabled} onClick={openChainModal} type='button'>
                    Wrong network
                  </button>
                )
              }

              return (
                <button disabled={disabled} onClick={openAccountModal} type='button' className='flex items-center'>
                  {/* <span className='font-bold mr-3 text-xs'>{account.displayName}</span> */}
                  <img
                    src='/images/lightGray-wallet.svg'
                    className='w-8 h-8 p-2 inline-block border rounded border-lightGray'
                    alt='Wallet'
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
