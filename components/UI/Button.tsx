import React, { ButtonHTMLAttributes, DetailedHTMLProps, forwardRef } from 'react'

interface ButtonProps
  extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  label?: string
  fullWidth?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { label, fullWidth, type = 'button', children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={`
        bg-black disabled:bg-[#D7D7D7] disabled:cursor-not-allowed hover:bg-[#959595] text-white font-bold py-3 px-10 rounded-lg ${
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
