import clsx from 'clsx'
import * as NextLink from 'next/link'

export const Link = ({
  children,
  title,
  href,
  disabled,
  className,
  size = 'sm',
  enabled = false,
  external = false,
  hover = false,
}: {
  href: string
  enabled?: boolean
  external?: boolean
  disabled?: boolean
  className?: string
  children?: React.ReactNode
  title?: string
  size?: 'sm' | 'md'
  hover?: boolean
}) => {
  return disabled ? (
    <div
      className={clsx(
        `cursor-pointer flex flex-row rounded-[5px] justify-between hover:bg-mediumGrey hover:bg-opacity-30`,
        enabled ? 'font-semibold' : '',
        size === 'sm' ? 'py-3' : 'py-2',
        enabled && hover ? 'bg-mediumGrey bg-opacity-40' : '',
        className
      )}
    >
      {title && (
        <div className='px-5 flex flex-row items-center text-black justify-between text-xs w-full'>
          <span>{title}</span>
        </div>
      )}
      {children}
    </div>
  ) : (
    <NextLink.default href={href}>
      {external ? (
        <a className={clsx(className)}>{children}</a>
      ) : (
        <a>
          <div
            className={clsx(
              `cursor-pointer flex flex-row rounded-[5px] justify-between hover:bg-mediumGrey hover:bg-opacity-30`,
              enabled ? 'font-semibold' : '',
              size === 'sm' ? 'py-3' : 'py-2',
              enabled && hover ? 'bg-mediumGrey bg-opacity-40' : '',
              className
            )}
          >
            {title && (
              <div className='px-5 flex flex-row items-center text-black justify-between text-xs w-full'>
                <span>{title}</span>
              </div>
            )}
            {children}
          </div>
        </a>
      )}
    </NextLink.default>
  )
}
