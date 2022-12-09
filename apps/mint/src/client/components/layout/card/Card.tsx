import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
}

const defaultProps: Props = { className: '' }

export type CardProps = Props & Omit<React.HTMLAttributes<any>, keyof Props>

const CardComponent: React.FC<React.PropsWithChildren<CardProps>> = ({
  children,
  className,
  ...props
}: CardProps & typeof defaultProps) => {
  return (
    <div
      className={clsx(
        className,
        'bg-background transition-all rounded-[5px] box-border border border-mediumGrey p-4',
      )}
      {...props}
    >
      {children}
    </div>
  )
}

CardComponent.defaultProps = defaultProps
CardComponent.displayName = 'Card'
export default CardComponent
