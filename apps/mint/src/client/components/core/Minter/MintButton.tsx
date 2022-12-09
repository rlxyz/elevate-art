import React from 'react'

import { Button } from '../UI/Button'

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
