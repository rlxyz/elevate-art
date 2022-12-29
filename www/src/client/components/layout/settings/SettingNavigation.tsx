import { NextLinkWithHoverHueComponent } from '@components/layout/link/NextLinkWithHoverHueComponent'
import type { FC } from 'react'
import { capitalize } from 'src/client/utils/format'

export const SettingNavigation: FC<{ routes: { name: string; href: string; selected: boolean }[] }> = ({ routes }) => {
  return (
    <div>
      {routes.map(({ name, href, selected }) => {
        return (
          <NextLinkWithHoverHueComponent key={name} href={href} enabled={selected}>
            {capitalize(name)}
          </NextLinkWithHoverHueComponent>
        )
      })}
    </div>
  )
}
