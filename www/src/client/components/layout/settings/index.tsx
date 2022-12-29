import SettingLayout from './SettingLayout'
import SettingLayoutBody from './SettingLayoutBody'
import SettingLayoutBodyError from './SettingLayoutBodyError'
import SettingLayoutHeader from './SettingLayoutHeader'

export type SettingLayoutComponentType = typeof SettingLayout & {
  Body: typeof SettingLayoutBody
  Error: typeof SettingLayoutBodyError
  Header: typeof SettingLayoutHeader
}
;(SettingLayout as SettingLayoutComponentType).Body = SettingLayoutBody
;(SettingLayout as SettingLayoutComponentType).Error = SettingLayoutBodyError
;(SettingLayout as SettingLayoutComponentType).Header = SettingLayoutHeader

export default SettingLayout as SettingLayoutComponentType
