import React, { ComponentPropsWithRef, forwardRef } from 'react'

type ButtonProps = {
  label?: string
  fullWidth?: boolean
} & ComponentPropsWithRef<'button'>

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { label, fullWidth, type = 'button', children, ...props },
    ref
  ) {
    return (
      <button
        ref={ref}
        className={`
         disabled:bg-disabledGray disabled:cursor-not-allowed font-semibold text-black disabled:text-white py-3 px-10 rounded-lg border border-lightGray ${
           fullWidth ? 'w-full' : ''
         }
      `}
        type={type}
        {...props}
      >
        {label || children}
      </button>
    )
  }
)
