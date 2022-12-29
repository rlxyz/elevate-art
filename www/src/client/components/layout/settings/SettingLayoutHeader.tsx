import clsx from 'clsx'
import type { FC } from 'react'

export interface Props {
  className?: string
  title: string
  description?: string
}

export type SettingLayoutHeaderProps = Props & Omit<React.AnchorHTMLAttributes<any>, keyof Props>

const SettingLayoutHeader: FC<SettingLayoutHeaderProps> = ({ title, description, className, ...props }: SettingLayoutHeaderProps) => {
  return (
    <div className={clsx('flex flex-col', className)} {...props}>
      <div className='col-span-6 font-plus-jakarta-sans space-y-2'>
        <h1 className='text-lg font-semibold text-black'>{title}</h1>
        {description && <p className='text-sm text-black'>{description}</p>}
      </div>
    </div>
  )
}

SettingLayoutHeader.displayName = 'SettingLayoutHeader'
export default SettingLayoutHeader
