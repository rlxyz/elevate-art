import { DecrementIncrementInput } from '@components/UI/DecrementIncrementInput'
import { config } from '@utils/config'
import React from 'react'

import { RequirementStatus } from './RequirementStatus'

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
    <>
      <div className="flex items-center p-4">
        <RequirementStatus passed={!disabled} />
        <DecrementIncrementInput
          maxValue={maxValue}
          onChange={onChange}
          value={value}
          disabled={disabled}
        />
        <span className="ml-3 mt-2 font-bold inline-block">{`${(
          value * config.ethPrice
        ).toFixed(2)} ETH`}</span>
      </div>
    </>
  )
}
