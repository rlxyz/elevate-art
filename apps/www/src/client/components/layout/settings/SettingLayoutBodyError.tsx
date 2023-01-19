import { ExclamationCircleIcon } from '@heroicons/react/outline'
import clsx from 'clsx'
import type { FC } from 'react'

export interface Props {
  className?: string
  message: string
}

export type SettingLayoutHeaderProps = Props & Omit<React.AnchorHTMLAttributes<any>, keyof Props>

const SettingLayoutBodyError: FC<SettingLayoutHeaderProps> = ({ message, className, ...props }: SettingLayoutHeaderProps) => {
  return (
    <span className={clsx('mt-2 col-span-10 text-xs w-full text-redError flex items-center space-x-1', className)} {...props}>
      <ExclamationCircleIcon className='text-redError w-4 h-4' />
      <span>{message}</span>
    </span>
  )
}

SettingLayoutBodyError.displayName = 'SettingLayoutBodyError'
export default SettingLayoutBodyError
