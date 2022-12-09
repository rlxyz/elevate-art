import { useMintPeriod } from 'src/client/hooks/contractsRead'

import { PresaleRequirements, PublicSaleRequirements } from '.'
import { Accordion } from '../UI/Accordion'

export const Requirements = () => {
  const { mintPhase } = useMintPeriod()

  if (mintPhase === 'none') {
    return null
  }

  if (mintPhase === 'presale') {
    return (
      <Accordion label="Presale Requirements">
        <PresaleRequirements />
      </Accordion>
    )
  }

  return (
    <Accordion label="Public Sale Requirements">
      <PublicSaleRequirements />
    </Accordion>
  )
}
