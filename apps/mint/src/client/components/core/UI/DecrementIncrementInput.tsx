import { MinusIcon, PlusIcon } from '@heroicons/react/outline'
import React from 'react'

interface DecrementIncrementInputProps {
  maxValue: number
  onChange: (value: number) => void
  value: number
  disabled?: boolean
}

export const DecrementIncrementInput: React.FC<DecrementIncrementInputProps> = ({ maxValue, onChange, value, disabled }) => {
  return (
    <>
      {/* <span className={`mr-3 text-xs ${value === maxValue ? 'text-black' : 'text-mediumGrey'}`}>Max</span> */}
      <div className='rounded-md border border-mediumGrey flex justify-between items-center'>
        <button
          disabled={disabled || value === 1}
          className='border-r border-mediumGrey px-2 py-2 disabled:cursor-not-allowed'
          onClick={() => {
            if (value > 1) {
              onChange && onChange(value - 1)
            }
          }}
          type='button'
        >
          <MinusIcon className='w-2 h-2 text-darkGrey' />
        </button>
        <div className='w-full flex items-center justify-between py-1 text-xs px-2'>
          <span>{value}</span>
        </div>
        <button
          disabled={disabled || value === maxValue}
          className='border-l border-mediumGrey p-2 disabled:cursor-not-allowed'
          onClick={() => {
            if (value < maxValue) {
              onChange(value + 1)
            }
          }}
        >
          <PlusIcon className='w-2 h-2 text-darkGrey' />
        </button>
      </div>
    </>
  )
}
