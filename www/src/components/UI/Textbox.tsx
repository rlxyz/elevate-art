import React from 'react'

type TextboxProps = {
  id: string
  name: string
  type: string
  placeholder?: string
} & React.ComponentPropsWithRef<'input'>

export const Textbox: React.FC<TextboxProps> = ({ placeholder, type, id, name, ...props }) => {
  return (
    <input
      className='bg-hue-light font-plus-jakarta-sans text-sm appearance-none block w-full bg-gray-200 text-gray-700 border border-lightGray rounded-lg py-3 px-4 leading-tight focus:outline-black focus:bg-white focus:border-gray-500'
      id={id}
      name={name}
      placeholder={placeholder || ''}
      type={type}
      {...props}
    />
  )
}
