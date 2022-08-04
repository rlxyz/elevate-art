import { PresaleRequirements, PublicSaleRequirements } from '@Components/MintRequirements'
import { Accordion } from '@Components/UI/Accordion'
import { useMintPeriod } from '@Hooks/contractsRead'

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
