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
  const childrens = React.Children.toArray(children)

  return (
    <div className={clsx(className, 'bg-background transition-all rounded-[5px] box-border border border-mediumGrey py-2')} {...props}>
      {childrens.map((child, index) => {
        return (
          <div key={index} className='px-4 py-2'>
            {child}
          </div>
        )
      })}
    </div>
  )
}

CardComponent.defaultProps = defaultProps
CardComponent.displayName = 'Card'
export default CardComponent
