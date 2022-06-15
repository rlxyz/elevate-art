import React from 'react'

import { Container } from './Container'
import { RequirementStatus } from './RequirementStatus'

interface PresaleAllocationProps {
  isEligible: boolean
  maxAllocation: number
}

export const PresaleAllocation: React.FC<PresaleAllocationProps> = ({
  isEligible,
  maxAllocation,
}) => {
  return (
    <Container>
      <RequirementStatus passed={isEligible} />

      {isEligible ? (
        <span>
          You are eligible for <strong>{`${maxAllocation} mint`}</strong>
        </span>
      ) : (
        <span>You are not eligible to mint</span>
      )}
    </Container>
  )
}
