import clsx from 'clsx'
import React from 'react'

interface Props {
  src?: string
  stacked?: boolean
  text?: string
  isSquare?: boolean
  className?: string
  variant?: 'sm' | 'md' | 'lg'
}

const defaultProps: Props = {
  stacked: false,
  text: '',
  isSquare: false,
  className: '',
  variant: 'sm',
}

type NativeAttrs = Omit<Partial<React.ImgHTMLAttributes<any> & React.HTMLAttributes<any>>, keyof Props>
export type AvatarProps = Props & NativeAttrs

const safeText = (text: string): string => {
  if (text.length <= 4) return text
  return text.slice(0, 3)
}

const AvatarComponent: React.FC<AvatarProps> = ({
  src,
  stacked,
  text,
  isSquare,
  className,
  variant,
  ...props
}: AvatarProps & typeof defaultProps) => {
  const showText = !src
  return (
    <span
      className={clsx(
        className,
        'inline-block relative overflow-hidden border border-mediumGrey align-top bg-background box-border p-0',
        stacked && 'ml-2.5',
        isSquare ? 'rounded-[5px]' : 'rounded-full',
        variant === 'sm' && 'w-5 h-5',
        variant === 'md' && 'w-8 h-8',
        variant === 'lg' && 'w-20 h-20'
      )}
    >
      {!showText && (
        <img
          alt='avatar-img'
          className={clsx('object-cover w-full select-none', isSquare ? 'rounded-[5px]' : 'rounded-full')}
          src={src}
          draggable={false}
          {...props}
        />
      )}
      {showText && text && (
        <span className={clsx('h-full flex justify-center text-xs items-center whitespace-nowrap select-none')} {...props}>
          {safeText(text)}
        </span>
      )}
    </span>
  )
}

AvatarComponent.defaultProps = defaultProps
AvatarComponent.displayName = 'Avatar'
export default AvatarComponent
