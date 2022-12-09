import React from 'react'
import { useGetProjectDetail } from 'src/client/hooks/useGetProjectDetail'

import { Container } from './Container'
import { RequirementStatus } from './RequirementStatus'

interface TotalMintedProps {
  totalMinted: number
  isEligible: boolean
}

export const TotalMinted: React.FC<TotalMintedProps> = ({ totalMinted, isEligible }) => {
  const { data } = useGetProjectDetail('rlxyz')
  return (
    <Container>
      <RequirementStatus passed={isEligible} />
      <span>
        This collection has minted{' '}
        <strong>{`${totalMinted}/${data?.totalSupply} NFTs`}</strong>
      </span>
    </Container>
  )
}
