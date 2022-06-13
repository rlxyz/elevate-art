import { usePresaleMaxAllocation } from '@hooks/contractsRead'
import { useAccount } from 'wagmi'

import { Container } from './Container'
import { RequirementStatus } from './RequirementStatus'

export const PresaleAllocation = () => {
  const { data: account } = useAccount()
  const maxAllocation = usePresaleMaxAllocation(account?.address)

  const userIsEligible = maxAllocation > 0

  return (
    <Container>
      <RequirementStatus passed={userIsEligible} />

      {userIsEligible ? (
        <span>
          You are eligible for <strong>{`${maxAllocation} mint`}</strong>
        </span>
      ) : (
        <span>You are not eligible to mint</span>
      )}
    </Container>
  )
}
