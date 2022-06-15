import React from 'react'

import { Container } from './Container'
import { RequirementStatus } from './RequirementStatus'

interface UserInAllowListProps {
  isEligible: boolean
}

export const UserInAllowList: React.FC<UserInAllowListProps> = ({ isEligible }) => {
  return (
    <Container>
      <RequirementStatus passed={isEligible} />
      <span>
        You are {isEligible ? '' : <strong>not</strong>} on the
        <strong> Allowlist</strong>
      </span>
    </Container>
  )
}
