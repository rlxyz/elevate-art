import { config } from '@utils/config'
import React from 'react'

import { Container } from './Container'
import { RequirementStatus } from './RequirementStatus'

interface TotalMintedProps {
  totalMinted: number
  isEligible: boolean
}

export const TotalMinted: React.FC<TotalMintedProps> = ({ totalMinted, isEligible }) => {
  return (
    <Container>
      <RequirementStatus passed={isEligible} />
      <span>
        This collection has minted{' '}
        <strong>{`${totalMinted}/${config.totalSupply} NFTs`}</strong>
      </span>
    </Container>
  )
}
