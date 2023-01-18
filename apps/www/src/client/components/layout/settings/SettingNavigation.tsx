import { NextLinkWithHoverHueComponent } from '@components/layout/link/NextLinkWithHoverHueComponent'
import type { FC } from 'react'
import { capitalize } from 'src/client/utils/format'

export const SettingNavigation: FC<{ routes: { name: string; href: string; selected: boolean; disabled?: boolean }[] }> = ({ routes }) => {
  return (
    <div>
      {routes.map(({ name, href, selected, disabled = false }) => {
        return (
          <NextLinkWithHoverHueComponent key={name} href={href} enabled={selected} disabled={disabled}>
            {capitalize(name)}
          </NextLinkWithHoverHueComponent>
        )
      })}
    </div>
  )
}
