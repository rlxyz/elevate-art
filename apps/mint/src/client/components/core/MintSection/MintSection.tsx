import { useMintPeriod } from 'src/client/hooks/contractsRead'

import { AllowlistCheckerView } from '../AllowlistCheckerView'
import { PresaleView } from './PresaleView'
import { PublicView } from './PublicView'

export const MintSection = () => {
  const { mintPhase } = useMintPeriod()

  if (mintPhase === 'presale') {
    return <PresaleView />
  }

  if (mintPhase === 'public') {
    return <PublicView />
  }

  return <AllowlistCheckerView />
}
