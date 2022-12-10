import React from 'react'

interface MintButtonProps {
  disabled?: boolean
  onClick: () => void
}

export const MintButton: React.FC<MintButtonProps> = ({ onClick, disabled = false }) => {
  return (
    <button
      className='w-full border border-mediumGrey bg-blueHighlight text-white rounded-[5px] py-2'
      disabled={disabled}
      onClick={onClick}
    >
      <span className='font-bold'>Mint</span>{' '}
    </button>
  )
}
