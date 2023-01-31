import clsx from 'clsx'
import React from 'react'
import AvatarComponent from './Avatar'

interface Props {
  className?: string
  padding?: 'none' | 'sm'
}

const defaultProps: Props = { className: '', padding: 'sm' }

export type CardProps = Props & Omit<React.HTMLAttributes<any>, keyof Props>

const ProfileAvatar: React.FC<React.PropsWithChildren<CardProps>> = ({
  children,
  className,
  ...props
}: CardProps & typeof defaultProps) => {
  return (
    <button className={clsx(className, 'flex')} {...props}>
      <AvatarComponent className='ring-4 ring-lightGray' src='/images/avatar-blank.png' />
    </button>
  )
}

ProfileAvatar.defaultProps = defaultProps
ProfileAvatar.displayName = 'CardAvatar'
export default ProfileAvatar
