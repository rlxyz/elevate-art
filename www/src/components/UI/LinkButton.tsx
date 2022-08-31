import * as React from 'react'

interface LinkButtonProps {
  href: string
  children?: React.ReactNode
}

export const LinkButton = ({ href, children }: LinkButtonProps) => {
  return (
    <a
      href={href}
      className={`
        bg-black disabled:bg-disabledGray disabled:cursor-not-allowed text-white font-bold py-3 px-10 rounded-lg`}
      target='_blank'
      rel='noreferrer noopener'
    >
      {children}
    </a>
  )
}
