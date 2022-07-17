import { useProjectDetail } from '@Context/projectContext'
import React from 'react'

import { Container } from './Container'
import { RequirementStatus } from './RequirementStatus'

interface TotalMintedProps {
  totalMinted: number
  isEligible: boolean
}

export const TotalMinted: React.FC<TotalMintedProps> = ({ totalMinted, isEligible }) => {
  const { totalSupply } = useProjectDetail()
  return (
    <Container>
      <RequirementStatus passed={isEligible} />
      <span>
        This collection has minted <strong>{`${totalMinted}/${totalSupply} NFTs`}</strong>
      </span>
    </Container>
  )
}
