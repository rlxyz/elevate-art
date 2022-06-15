import { Disconnected } from '@components/Minter/Disconnected'
import { PresaleMintSection } from '@components/Minter/PresaleMintSection'
import { PublicSaleMintSection } from '@components/Minter/PublicSaleMintSection'
import { useMintPeriod } from '@hooks/contractsRead'
import { useConnect } from 'wagmi'

export const MintSection = () => {
  const { isConnected } = useConnect()
  const { mintPhase } = useMintPeriod()

  if (!isConnected) {
    return <Disconnected />
  }

  if (mintPhase === 'none' || mintPhase === 'presale') {
    return <PresaleMintSection />
  }

  return <PublicSaleMintSection />
}
