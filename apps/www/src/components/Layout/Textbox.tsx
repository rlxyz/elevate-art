import clsx from 'clsx'
import React from 'react'

type TextboxProps = {
  id: string
  name: string
  type: string
  placeholder?: string
} & React.ComponentPropsWithRef<'input'>

export const Textbox: React.FC<TextboxProps> = ({ placeholder, type, id, name, className, ...props }) => {
  return (
    <input
      className={clsx(
        'bg-white font-plus-jakarta-sans text-xs appearance-none block w-full text-black border border-mediumGrey rounded-[5px] py-1 px-2',
        className
      )}
      id={id}
      name={name}
      placeholder={placeholder || ''}
      type={type}
      {...props}
    />
  )
}
