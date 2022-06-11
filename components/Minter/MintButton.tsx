import { Button } from '@components/Button'
import React from 'react'

interface MintButtonProps {
  mintCount: number
}

export const MintButton: React.FC<MintButtonProps> = ({ mintCount }) => {
  return (
    <Button fullWidth>
      <span className="font-bold">{`Mint ${mintCount}`}</span>{' '}
      <span className="font-light">NFTs</span>
    </Button>
  )
}
