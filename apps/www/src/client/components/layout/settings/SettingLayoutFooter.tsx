import type { FC } from 'react'

export interface Props {
  className?: string
}

export type SettingLayoutFooterProps = Props & Omit<React.AnchorHTMLAttributes<any>, keyof Props>

const SettingLayoutFooter: FC<SettingLayoutFooterProps> = ({ children, ...props }: SettingLayoutFooterProps) => {
  return <div {...props}>{children}</div>
}

SettingLayoutFooter.displayName = 'SettingLayoutFooter'
export default SettingLayoutFooter
