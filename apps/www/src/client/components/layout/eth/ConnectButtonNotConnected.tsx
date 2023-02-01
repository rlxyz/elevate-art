import { ConnectButton as RbConnectButton } from '@rainbow-me/rainbowkit'
import Image from 'next/image'
import Card from '../card/Card'

export const ConnectButtonNotConnected = () => {
  return (
    <RbConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, authenticationStatus, mounted }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading'

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              className: 'opacity-0 pointer-events-none user-select-none',
            })}
          >
            {(() => {
              return (
                <button onClick={openConnectModal} type='button' className='w-full'>
                  <Card>
                    <div className='flex flex-row items-center space-x-2 cursor-pointer'>
                      <Image src='/images/rainbow.png' alt='rainbow-wallet' width={35} height={35} className='rounded-primary' />
                      <span className='font-semibold'>Rainbow</span>
                    </div>
                  </Card>
                </button>
              )
            })()}
          </div>
        )
      }}
    </RbConnectButton.Custom>
  )
}
