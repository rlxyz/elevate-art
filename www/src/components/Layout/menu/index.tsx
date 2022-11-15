import Menu from './Menu'
import MenuItem from './MenuItem'
import MenuItems from './MenuItems'

export type MenuComponentType = typeof Menu & {
  Item: typeof MenuItem
  Items: typeof MenuItems
}
;(Menu as MenuComponentType).Item = MenuItem
;(Menu as MenuComponentType).Items = MenuItems

export type { MenuProps } from './Menu'
export default Menu as MenuComponentType
