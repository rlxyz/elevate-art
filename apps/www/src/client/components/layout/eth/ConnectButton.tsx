import { ConnectButton as RbConnectButton } from '@rainbow-me/rainbowkit'
import React from 'react'
import AvatarComponent from '../avatar/Avatar'

interface ConnectButtonProps {
  normalButton?: boolean
  disabled?: boolean
  children?: React.ReactNode
}

export const ConnectButton: React.FC<ConnectButtonProps> = ({ children }) => {
  return (
    <RbConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, authenticationStatus, mounted }) => {
        const ready = mounted && authenticationStatus !== 'loading'
        const connected = ready && account && chain && (!authenticationStatus || authenticationStatus === 'authenticated')
        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button onClick={openConnectModal} type='button' className='w-full'>
                    {children || (
                      <img
                        src='/images/lightGray-wallet.svg'
                        className='w-8 h-8 p-2 inline-block border rounded-[5px] border-mediumGrey'
                        alt='Wallet'
                      />
                    )}
                  </button>
                )
              }

              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type='button' className='w-full'>
                    {children || (
                      <img
                        src='/images/lightGray-wallet.svg'
                        className='w-8 h-8 p-2 inline-block border rounded-[5px] border-mediumGrey'
                        alt='Wallet'
                      />
                    )}
                  </button>
                )
              }

              return (
                <button onClick={openAccountModal} type='button' className='w-full'>
                  {children || <AvatarComponent className='w-4 h-4 text-darkGrey' src='/images/avatar-blank.png' />}
                </button>
              )
            })()}
          </div>
        )
      }}
    </RbConnectButton.Custom>
  )
}
