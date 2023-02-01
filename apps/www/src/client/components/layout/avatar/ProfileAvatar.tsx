import clsx from 'clsx'
import React from 'react'
import AvatarComponent from './Avatar'
import { RingOuterWithShadow } from './RingOuterWithShadow'

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
    <button className={clsx(className)} {...props}>
      <RingOuterWithShadow>
        <AvatarComponent src='/images/avatar-blank.png' />
      </RingOuterWithShadow>
    </button>
  )
}

ProfileAvatar.defaultProps = defaultProps
ProfileAvatar.displayName = 'CardAvatar'
export default ProfileAvatar
