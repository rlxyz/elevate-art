import { Button } from '@Components/UI/Button'
import React from 'react'

interface MintButtonProps {
  disabled?: boolean
  onClick: () => void
}

export const MintButton: React.FC<MintButtonProps> = ({ onClick, disabled = false }) => {
  return (
    <Button fullWidth disabled={disabled} onClick={onClick}>
      <span className="font-bold">Mint</span>{' '}
    </Button>
  )
}
