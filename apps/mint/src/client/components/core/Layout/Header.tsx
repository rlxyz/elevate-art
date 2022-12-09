import { useMintPeriod } from 'src/client/hooks/contractsRead'

import { ConnectButton } from '../ConnectButton'

export const Header = () => {
  const { mintPhase } = useMintPeriod()
  return (
    <header className="w-full flex justify-between h-[5rem] px-4 lg:py-8 lg:px-8 pointer-events-auto border-b border-b-lightGray items-center">
      <div>
        <img src="/images/logo.svg" alt="Logo" />
      </div>
      {mintPhase !== 'none' && (
        <div className="ml-4 md:block flex justify-center space-x-6 md:order-2">
          <ConnectButton />
        </div>
      )}
    </header>
  )
}
