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

// export const Link = ({
//   children,
//   title,
//   href,
//   disabled,
//   className,
//   enabled = false,
//   external = false,
//   hover = false,
//   rounded = true,
// }: {
//   href: string
//   enabled?: boolean
//   external?: boolean
//   disabled?: boolean
//   className?: string
//   children?: React.ReactNode
//   title?: string
//   hover?: boolean
//   rounded?: boolean
// }) => {
//   return disabled ? (
//     <div className={'py-2'}>
//       {title && (
//         <div className='px-5 flex flex-row items-center text-foreground justify-between text-xs w-full'>
//           <span>{title}</span>
//         </div>
//       )}
//       {children}
//     </div>
//   ) : (
//     <NextLink.default href={href}>
//       {external ? (
//         <a className={clsx(className)}>{children}</a>
//       ) : (
//         <a>
//           <div
//             className={clsx(
//               `cursor-pointer flex flex-row justify-between hover:bg-accents_8 py-2`,
//               enabled ? 'font-semibold' : '',
//               enabled && hover ? 'bg-accents_8' : '',
//               rounded ? 'rounded-[5px]' : '',
//               className
//             )}
//           >
//             {title && (
//               <div className='px-5 flex flex-row items-center text-foreground justify-between text-xs w-full'>
//                 <span>{title}</span>
//               </div>
//             )}
//             {children}
//           </div>
//         </a>
//       )}
//     </NextLink.default>
//   )
// }
