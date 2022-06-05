import * as React from 'react'

import styles from './Button.module.css'

interface ButtonLinkProps {
  label: string
  href: string
  className?: string
  children?: React.ReactChild
}

export const ButtonLink = ({ label, href, className, children }: ButtonLinkProps) => {
  return (
    <a
      href={href}
      className={`${styles.button} ${className}`}
      target="_blank"
      rel="noreferrer noopener"
    >
      {label || children}
    </a>
  )
}
