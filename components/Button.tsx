import React from 'react'

interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  label?: string
  fullWidth?: boolean
}

export const Button = ({
  label,
  fullWidth,
  type = 'button',
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
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
}
