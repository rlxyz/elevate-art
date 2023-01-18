import SettingLayout from './SettingLayout'
import SettingLayoutBody from './SettingLayoutBody'
import SettingLayoutBodyError from './SettingLayoutBodyError'
import SettingLayoutFooter from './SettingLayoutFooter'
import SettingLayoutHeader from './SettingLayoutHeader'

export type SettingLayoutComponentType = typeof SettingLayout & {
  Body: typeof SettingLayoutBody
  Error: typeof SettingLayoutBodyError
  Header: typeof SettingLayoutHeader
  Footer: typeof SettingLayoutFooter
}
;(SettingLayout as SettingLayoutComponentType).Body = SettingLayoutBody
;(SettingLayout as SettingLayoutComponentType).Error = SettingLayoutBodyError
;(SettingLayout as SettingLayoutComponentType).Header = SettingLayoutHeader
;(SettingLayout as SettingLayoutComponentType).Footer = SettingLayoutFooter

export default SettingLayout as SettingLayoutComponentType
