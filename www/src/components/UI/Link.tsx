import { toPascalCaseWithSpace } from '@utils/format'
import * as NextLink from 'next/link'

export const Link = ({
  children,
  title,
  href,
  className,
  size = 'sm',
  enabled = false,
  external = false,
  pascalCase = true,
}: {
  href: string
  enabled?: boolean
  external?: boolean
  className?: string
  children?: React.ReactNode
  title?: string
  size?: 'sm' | 'md'
  pascalCase?: boolean
}) => {
  return (
    <NextLink.default href={href}>
      {external ? (
        <a>{children}</a>
      ) : (
        <div
          className={
            !className
              ? `cursor-pointer flex flex-row rounded-[5px] justify-between hover:bg-mediumGrey hover:bg-opacity-30 ${
                  enabled ? 'bg-mediumGrey bg-opacity-50 font-semibold' : ''
                } ${size === 'sm' ? 'py-3' : 'py-2'}`
              : className
          }
        >
          {title && (
            <div className='px-5 flex flex-row items-center justify-between text-xs w-full'>
              <span>{pascalCase ? toPascalCaseWithSpace(title) : title}</span>
            </div>
          )}
          {children}
        </div>
      )}
    </NextLink.default>
  )
}
