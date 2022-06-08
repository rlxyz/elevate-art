import React from 'react'

interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  label?: string
}

export const Button = ({ label, type = 'button', children, ...props }: ButtonProps) => {
  return (
    <button
      className="bg-black disabled:bg-[#D7D7D7] disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg w-full"
      type={type}
      {...props}
    >
      {label || children}
    </button>
  )
}
