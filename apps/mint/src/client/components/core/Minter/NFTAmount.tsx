import React from 'react'

import { DecrementIncrementInput } from '../UI/DecrementIncrementInput'

interface NFTAmountProps {
  maxValue: number
  onChange: (value: number) => void
  value: number
  disabled?: boolean
}

export const NFTAmount: React.FC<NFTAmountProps> = ({
  maxValue,
  onChange,
  value,
  disabled,
}) => {
  return (
    <div className="flex justify-between items-center">
      <span className="block font-plus-jakarta-sans font-bold">Amount</span>
      <div className="flex items-center py-4">
        <DecrementIncrementInput
          maxValue={maxValue}
          onChange={onChange}
          value={value}
          disabled={disabled}
        />
      </div>
    </div>
  )
}
