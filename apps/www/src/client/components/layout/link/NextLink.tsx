import clsx from 'clsx'
import { default as NextLink } from 'next/link'
import React from 'react'
import type { LinkProps } from './Link'
import LinkIcon from './LinkIcon'

const defaultProps: LinkProps = {
  href: '/',
  color: false,
  icon: false,
  underline: false,
  block: false,
  className: '',
}

export type NextLinkProps = LinkProps & Omit<React.AnchorHTMLAttributes<any>, keyof LinkProps>

const NextLinkComponent = React.forwardRef<HTMLAnchorElement, React.PropsWithChildren<LinkProps>>(
  (
    { href, color, underline, children, className, block, icon, ...props }: React.PropsWithChildren<LinkProps> & typeof defaultProps,
    ref: React.Ref<HTMLAnchorElement>
  ) => {
    return (
      <NextLink
        href={href || '/404'}
        className={clsx(
          'inline-flex items-baseline no-underline',
          'text-inherit w-full h-auto',
          underline && 'hover:underline hover:text-blueHighlight',
          color && 'text-blueHighlight',
          block && 'rounded-[5px] hover:bg-accents_8 px-3 py-2',
          block && color && 'hover:bg-lightGray',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
        {icon && <LinkIcon />}
      </NextLink>
    )
  }
)

NextLinkComponent.defaultProps = defaultProps
NextLinkComponent.displayName = 'NextLink'
export default NextLinkComponent
