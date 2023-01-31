import { ExternalLinkIcon } from '@heroicons/react/outline'
import { ConnectButton as RbConnectButton } from '@rainbow-me/rainbowkit'
import { ZoneNavigationEnum } from '@utils/enums'
import Image from 'next/image'
import React from 'react'
import { routeBuilder } from 'src/client/utils/format'
import AvatarComponent from '../avatar/Avatar'
import NextLinkComponent from '../link/NextLink'
import Menu from '../menu'

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
              className: 'opacity-0 pointer-events-none user-select-none',
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button onClick={openConnectModal} type='button' className='w-full'>
                    {children || (
                      <Image
                        src='/images/lightGray-wallet.svg'
                        width={18}
                        height={18}
                        className='inline-block rounded-[5px]'
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
                      <Image
                        src='/images/lightGray-wallet.svg'
                        width={18}
                        height={18}
                        className='inline-block rounded-[5px]'
                        alt='Wallet'
                      />
                    )}
                  </button>
                )
              }

              return (
                <div className='relative w-9'>
                  <Menu profile position='bottom-left'>
                    <Menu.Items className='p-0'>
                      <Menu.Item as={NextLinkComponent} href={routeBuilder(ZoneNavigationEnum.enum.Dashboard)} type='button'>
                        <div className='w-full flex items-center space-x-2 p-1'>
                          <AvatarComponent variant='sm' src='/images/avatar-blank.png' />
                          <span className='text-xs font-semibold'>Dashboard</span>
                        </div>
                      </Menu.Item>
                    </Menu.Items>
                    <Menu.Items className='p-1'>
                      <div className='rounded-[5px] w-full p-2'>
                        <div className='flex flex-col'>
                          <span className='text-xs text-darkGrey'>Balance</span>
                          <span className='text-sm text-black font-bold'>{account.displayBalance}</span>
                        </div>
                      </div>
                    </Menu.Items>
                    <Menu.Items>
                      <Menu.Item as='button' onClick={openAccountModal} type='button' className='w-full flex items-center'>
                        <div className='w-full flex items-center space-x-3'>
                          <ExternalLinkIcon className='w-4 h-4' />
                          <span className='text-xs'>Disconnect</span>
                        </div>
                      </Menu.Item>
                    </Menu.Items>
                  </Menu>
                </div>
              )
            })()}
          </div>
        )
      }}
    </RbConnectButton.Custom>
  )
}
