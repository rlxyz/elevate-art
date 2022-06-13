import { useTotalSupply } from '@hooks/contractsRead'
import { config } from '@utils/config'

import { Container } from './Container'
import { RequirementStatus } from './RequirementStatus'

export const TotalMinted = () => {
  const totalMinted = useTotalSupply()

  const userIsEligible = totalMinted < config.totalSupply

  return (
    <Container>
      <RequirementStatus passed={userIsEligible} />
      <span>
        This collection has minted{' '}
        <strong>{`${totalMinted}/${config.totalSupply} NFTs`}</strong>
      </span>
    </Container>
  )
}
