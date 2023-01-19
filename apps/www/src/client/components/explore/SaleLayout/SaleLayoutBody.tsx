import { forwardRef } from 'react'

export interface Props {
  className?: string
}

export type SaleLayoutBodyProps = Props & Omit<React.AnchorHTMLAttributes<any>, keyof Props>

export const SaleLayoutBody = forwardRef<HTMLFormElement, React.PropsWithChildren<SaleLayoutBodyProps>>(({ children, ...props }) => {
  return <form {...props}>{children}</form>
})

SaleLayoutBody.displayName = 'SaleLayoutBody'
