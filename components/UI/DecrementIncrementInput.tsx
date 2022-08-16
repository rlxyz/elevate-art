import React from 'react'

interface DecrementIncrementInputProps {
  maxValue: number
  onChange: (value: number) => void
  value: number
  disabled?: boolean
}

export const DecrementIncrementInput: React.FC<
  DecrementIncrementInputProps
> = ({ maxValue, onChange, value, disabled }) => {
  return (
    <>
      <span
        className={`mr-3 text-xs ${
          value === maxValue ? 'text-black' : 'text-lightGray'
        }`}
      >
        Max
      </span>
      <div className='rounded-md border border-lightGray flex justify-between items-center'>
        <div className='w-[50px] border-r border-r-lightGray'>
          <button
            disabled={disabled || value === 1}
            className='text-xl w-full font-bold text-center pb-2 disabled:text-lightGray'
            onClick={() => {
              if (value > 1) {
                onChange && onChange(value - 1)
              }
            }}
          >
            -
          </button>
        </div>
        <div className='w-[50px] text-center'>
          <span>{value}</span>
        </div>
        <div className='w-[50px] border-l border-l-lightGray flex items-center'>
          <button
            disabled={disabled || value === maxValue}
            className='text-xl font-bold w-full text-center disabled:text-lightGray pb-2'
            onClick={() => {
              if (value < maxValue) {
                onChange(value + 1)
              }
            }}
          >
            +
          </button>
        </div>
      </div>
    </>
  )
}
