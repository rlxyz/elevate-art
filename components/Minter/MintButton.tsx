import { Button } from '@components/UI/Button'
import React from 'react'

interface MintButtonProps {
  disabled?: boolean
  mintCount: number
  onClick: () => void
}

export const MintButton: React.FC<MintButtonProps> = ({
  mintCount,
  onClick,
  disabled = false,
}) => {
  return (
    <Button fullWidth disabled={disabled} onClick={onClick}>
      <span className="font-bold">{`Mint ${mintCount}`}</span>{' '}
      <span className="font-light">NFTs</span>
    </Button>
  )
}
