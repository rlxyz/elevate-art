import { usePresaleMaxAllocation } from '@hooks/contractsRead'
import { useAccount } from 'wagmi'

import { Container } from './Container'
import { RequirementStatus } from './RequirementStatus'

export const UserInAllowList = () => {
  const { data: account } = useAccount()
  const maxAllocation = usePresaleMaxAllocation(account?.address)

  const userIsEligible = maxAllocation > 0

  return (
    <Container>
      <RequirementStatus passed={userIsEligible} />
      <span>
        You are {userIsEligible ? '' : <strong>not</strong>} on the
        <strong> Allowlist</strong>
      </span>
    </Container>
  )
}
