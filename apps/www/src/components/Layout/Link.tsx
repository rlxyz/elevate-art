import { Link } from '@elevateart/ui'
import { LinkProps } from '@elevateart/ui/link'
import { default as NextLink } from 'next/link'
import React from 'react'

export interface Props extends LinkProps {}

const defaultProps: Props = {
  href: '/',
  color: false,
  icon: false,
  underline: false,
  block: false,
  className: '',
}

export type NextLinkProps = Props & Omit<React.AnchorHTMLAttributes<any>, keyof Props>

const NextLinkComponent = React.forwardRef<HTMLAnchorElement, React.PropsWithChildren<LinkProps>>(
  (
    {
      href,
      color,
      underline,
      children,
      className,
      block,
      icon,
      ...props
    }: React.PropsWithChildren<LinkProps> & typeof defaultProps,
    ref: React.Ref<HTMLAnchorElement>
  ) => {
    return (
      <NextLink href={href || '/404'}>
        <Link
          href={href}
          className={className}
          ref={ref}
          color={color}
          underline={underline}
          block={block}
          icon={icon}
          {...props}
        >
          {children}
        </Link>
      </NextLink>
    )
  }
)

NextLinkComponent.defaultProps = defaultProps
NextLinkComponent.displayName = 'Link'
export default NextLinkComponent
