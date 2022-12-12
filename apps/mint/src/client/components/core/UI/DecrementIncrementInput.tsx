import { MinusIcon, PlusIcon } from '@heroicons/react/outline'
import { BigNumber, ethers } from 'ethers'
import React from 'react'

interface DecrementIncrementInputProps {
  maxValue: BigNumber | undefined
  value: BigNumber
  onChange: (value: BigNumber) => void
  disabled?: boolean
}

export const DecrementIncrementInput: React.FC<DecrementIncrementInputProps> = ({ maxValue, onChange, value, disabled }) => {
  return (
    <div className='rounded-md border border-mediumGrey flex justify-between items-center'>
      <button
        disabled={disabled || BigNumber.from(value).eq(1)}
        className='border-r border-mediumGrey px-2 py-2 disabled:cursor-not-allowed'
        onClick={() => {
          if (value.gt(1)) {
            onChange && onChange(BigNumber.from(value).sub(1))
          }
        }}
        type='button'
      >
        <MinusIcon className='w-2 h-2 text-darkGrey' />
      </button>
      <div className='w-full flex items-center justify-between py-1 text-xs px-2'>
        <span>{ethers.utils.formatUnits(value, 0)}</span>
      </div>
      <button
        disabled={!maxValue || disabled || BigNumber.from(value).eq(maxValue)}
        className='border-l border-mediumGrey p-2 disabled:cursor-not-allowed'
        onClick={() => {
          if (maxValue && value < maxValue) {
            onChange && onChange(BigNumber.from(value).add(1))
          }
        }}
        type='button'
      >
        <PlusIcon className='w-2 h-2 text-darkGrey' />
      </button>
    </div>
  )
}
