import { Button } from '@components/UI/Button'
import React from 'react'

interface MintButtonProps {
  disabled?: boolean
  mintCount: number
}

export const MintButton: React.FC<MintButtonProps> = ({
  mintCount,
  disabled = false,
}) => {
  return (
    <Button fullWidth disabled={disabled}>
      <span className="font-bold">{`Mint ${mintCount}`}</span>{' '}
      <span className="font-light">NFTs</span>
    </Button>
  )
}
