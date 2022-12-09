import React, { ComponentPropsWithRef, forwardRef } from 'react'

type ButtonProps = {
  label?: string
  fullWidth?: boolean
} & ComponentPropsWithRef<'button'>

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { label, fullWidth, type = 'button', children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={`
        bg-black disabled:bg-disabledGray disabled:cursor-not-allowed text-white font-bold py-3 px-10 rounded-lg ${
          fullWidth ? 'w-full' : ''
        }
      `}
      type={type}
      {...props}
    >
      {label || children}
    </button>
  )
})
