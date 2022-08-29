import React, { ComponentPropsWithRef, forwardRef } from 'react'

type ButtonProps = {
  label?: string
} & ComponentPropsWithRef<'button'>

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { label, type = 'button', children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={`
         disabled:bg-disabledGray disabled:cursor-not-allowed font-semibold text-white bg-black min-h-full min-w-[6rem] disabled:text-white w-full h-full rounded-[5px] border border-lightGray shadow-sm
      `}
      type={type}
      {...props}
    >
      {label || children}
    </button>
  )
})
