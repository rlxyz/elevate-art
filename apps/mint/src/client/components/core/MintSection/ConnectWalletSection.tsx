import { useAccount } from 'wagmi'

import { ConnectButton } from '../ConnectButton'

export const ConnectWalletSection = () => {
  const { isConnected } = useAccount()
  return (
    <div className="flex pt-3 pb-8 justify-between items-center">
      <span>
        <strong>Wallet</strong>{' '}
        <span
          className={`h-[12px] w-[12px] ${
            isConnected ? 'bg-greenDot' : 'bg-redDot'
          } rounded-full inline-block ml-2`}
        ></span>
      </span>
      <ConnectButton />
    </div>
  )
}
