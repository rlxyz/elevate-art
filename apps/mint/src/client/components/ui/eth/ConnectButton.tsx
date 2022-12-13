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
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
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
                  <button onClick={openConnectModal} className='mx-auto flex items-center justify-center'>
                    <div className='rounded-[4px] bg-gradient-to-r from-[#00ffff] to-blueHighlight p-0.5'>
                      <div className='rounded-[3px] flex h-max w-max items-center justify-center bg-white'>
                        <h1 className='font-bold text-transparent text-xs bg-clip-text bg-gradient-to-r px-3 py-2'>Connect</h1>
                      </div>
                    </div>
                  </button>
                )
              }

              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} className='mx-auto flex items-center justify-center'>
                    <div className='rounded-[4px] bg-gradient-to-r from-[#00ffff] to-blueHighlight p-0.5'>
                      <div className='rounded-[3px] flex h-max w-max items-center justify-center bg-white'>
                        <h1 className='font-bold text-transparent text-xs bg-clip-text bg-gradient-to-r px-3 py-2'>Connect</h1>
                      </div>
                    </div>
                  </button>
                )
              }

              return (
                <button onClick={openAccountModal} type='button' className='w-full flex items-center justify-center'>
                  {children || <AvatarComponent className='text-darkGrey' src='/images/avatar-blank.png' />}
                </button>
              )
            })()}
          </div>
        )
      }}
    </RbConnectButton.Custom>
  )
}
