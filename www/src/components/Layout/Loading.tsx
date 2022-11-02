import clsx from 'clsx'
import React from 'react'

// @todo implement all different variations: success/error/default/etc

interface Props {
  color?: string
  className?: string
  spaceRatio?: number
}

const defaultProps: Props = {
  className: '',
  spaceRatio: 1,
}

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>
export type LoadingProps = Props & NativeAttrs

const LoadingComponent: React.FC<React.PropsWithChildren<LoadingProps>> = ({
  children,
  color,
  className,
  spaceRatio,
  ...props
}: React.PropsWithChildren<LoadingProps> & typeof defaultProps) => {
  return (
    <div
      className={clsx(className, 'relative inline-flex justify-center items-center text-xs w-full h-full min-h-4 p-0 m-0')}
      {...props}
    >
      <span className='absolute flex justify-center items-center bg-transparent select-none top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2'>
        {children && <label className='mr-2 text-darkGrey leading-none'>{children}</label>}
        <i
          className='w-1 h-1 rounded-full inline-block bg-darkGrey animate-pulse'
          style={{
            margin: `0 calc(0.25em / 2 * ${spaceRatio})`,
          }}
        />
        <i
          className='w-1 h-1 rounded-full inline-block bg-darkGrey animate-pulse'
          style={{
            margin: `0 calc(0.25em / 2 * ${spaceRatio})`,
            animationDelay: '0.2s',
          }}
        />
        <i
          className='w-1 h-1 rounded-full inline-block bg-darkGrey animate-pulse'
          style={{
            margin: `0 calc(0.25em / 2 * ${spaceRatio})`,
            animationDelay: '0.4s',
          }}
        />
      </span>
    </div>
  )
}

LoadingComponent.defaultProps = defaultProps
LoadingComponent.displayName = 'Loading'
export default LoadingComponent
