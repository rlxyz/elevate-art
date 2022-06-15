import React from 'react'

interface DecrementIncrementInputProps {
  maxValue: number
  onChange: (value: number) => void
  value: number
}

export const DecrementIncrementInput: React.FC<DecrementIncrementInputProps> = ({
  maxValue,
  onChange,
  value,
}) => {
  return (
    <div>
      <div className="mt-1 relative rounded-md shadow-sm w-[150px]">
        <div className="absolute inset-y-0 left-0 flex items-center px-4">
          <button
            className="text-2xl flex items-center"
            onClick={() => {
              if (value > 1) {
                onChange && onChange(value - 1)
              }
            }}
          >
            -
          </button>
        </div>
        <input
          type="number"
          name="price"
          id="price"
          className="focus:ring-indigo-500 focus:border-indigo-500 px-4 sm:text-sm border-gray rounded-md text-center w-full h-10"
          min={1}
          max={maxValue}
          value={value}
          disabled
        />
        <div className="absolute inset-y-0 right-0 flex items-center px-4">
          <button
            className="text-2xl flex items-center"
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
    </div>
  )
}
