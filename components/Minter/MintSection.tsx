import { Disconnected } from '@components/Minter/Disconnected'
import { PresaleMintSection } from '@components/Minter/PresaleMintSection'
import { PublicSaleMintSection } from '@components/Minter/PublicSaleMintSection'
import { useMintPeriod } from '@hooks/contractsRead'
import { useAccount } from 'wagmi'

export const MintSection = () => {
  const { isConnected } = useAccount()
  const { mintPhase } = useMintPeriod()

  if (!isConnected) {
    return <Disconnected />
  }

  if (mintPhase === 'none' || mintPhase === 'presale') {
    return <PresaleMintSection />
  }

  return <PublicSaleMintSection />
}
