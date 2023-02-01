import clsx from 'clsx'
import React from 'react'

export interface Props {
  className?: string
}

export type SettingBodyProps = Props & Omit<React.AnchorHTMLAttributes<any>, keyof Props>
const SettingLayoutBody = ({ children, className, ...props }: SettingBodyProps) => {
  return (
    <div className={clsx(className)} {...props}>
      {children}
    </div>
  )
}

SettingLayoutBody.displayName = 'SettingLayoutBody'
export default SettingLayoutBody
