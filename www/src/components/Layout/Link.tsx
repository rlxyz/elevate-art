import clsx from 'clsx'
import * as NextLink from 'next/link'

export const Link = ({
  children,
  title,
  href,
  disabled,
  className,
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
  hover?: boolean
}) => {
  return disabled ? (
    <div className={'py-3'}>
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
              `cursor-pointer flex flex-row justify-between hover:bg-lightGray py-2`,
              enabled ? 'font-semibold' : '',
              enabled && hover ? 'bg-lightGray' : '',
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
