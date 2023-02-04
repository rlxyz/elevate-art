import { ExternalLinkIcon } from '@heroicons/react/outline'
import { ConnectButton as RbConnectButton } from '@rainbow-me/rainbowkit'
import { ZoneNavigationEnum } from '@utils/enums'
import { formatEthereumHash } from '@utils/ethers'
import clsx from 'clsx'
import { useSession } from 'next-auth/react'
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
  const { data } = useSession()
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
                  <button onClick={openConnectModal}>
                    <span className='w-fit cursor-pointer h-fit bg-black rounded-full text-white text-xs p-2'>Connect</span>
                    {/* <Menu profile position='bottom-left'>
                      <Menu.Items className='p-0'>
                        <Menu.Item as='button' onClick={openConnectModal} type='button'>
                          <div className='w-full flex items-center space-x-2 p-1'>
                            <AvatarComponent variant='sm' src='/images/avatar-blank.png' />
                            <span className='text-xs font-semibold'>Connect Now</span>
                          </div>
                        </Menu.Item>
                      </Menu.Items>
                    </Menu> */}
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
                    {data?.user?.address && (
                      <Menu.Items className='p-1'>
                        <div className='rounded-[5px] w-full p-2'>
                          <div className='flex flex-col'>
                            <div className='flex justify-between'>
                              <span className='text-xs text-darkGrey'>Address</span>
                              <button
                                className={clsx(
                                  'text-[0.6rem] border px-3 rounded-[5px]',
                                  data.user.address === account.address
                                    ? 'border-blueHighlight text-blueHighlight'
                                    : 'border-redError text-redError'
                                )}
                                onClick={openAccountModal}
                              >
                                {data.user.address === account.address ? 'Connected' : 'Change Account'}
                              </button>
                            </div>
                            <span className='text-sm text-black font-bold'>{formatEthereumHash(data.user.address)}</span>
                          </div>
                        </div>
                      </Menu.Items>
                    )}
                    {account?.address && (
                      <Menu.Items className='p-1'>
                        <div className='rounded-[5px] w-full p-2'>
                          <div className='flex flex-col'>
                            <div className='flex justify-between'>
                              <span className='text-xs text-darkGrey'>Balance</span>
                              <span className='text-[0.6rem] border px-3 border-blueHighlight rounded-[5px] text-blueHighlight'>
                                {chain?.name}
                              </span>
                            </div>
                            <span className='text-sm text-black font-bold'>{account.displayBalance}</span>
                          </div>
                        </div>
                      </Menu.Items>
                    )}
                    <Menu.Items>
                      {!connected ? (
                        <>
                          <Menu.Item as='button' onClick={openConnectModal} type='button' className='w-full flex items-center'>
                            <div className='w-full flex items-center space-x-3'>
                              <ExternalLinkIcon className='w-4 h-4' />
                              <span className='text-xs'>Connect Now</span>
                            </div>
                          </Menu.Item>
                        </>
                      ) : (
                        <>
                          <Menu.Item as='button' onClick={openAccountModal} type='button' className='w-full flex items-center'>
                            <div className='w-full flex items-center space-x-3'>
                              <ExternalLinkIcon className='w-4 h-4' />
                              <span className='text-xs'>Disconnect</span>
                            </div>
                          </Menu.Item>
                        </>
                      )}
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
