import * as React from 'react'

interface ButtonLinkProps {
  href: string
  children?: React.ReactNode
}

export const ButtonLink = ({ href, children }: ButtonLinkProps) => {
  return (
    <a
      href={href}
      className={`
        bg-black disabled:bg-[#D7D7D7] disabled:cursor-not-allowed hover:bg-[#959595] text-white font-bold py-3 px-10 rounded-lg`}
      target="_blank"
      rel="noreferrer noopener"
    >
      {children}
    </a>
  )
}
