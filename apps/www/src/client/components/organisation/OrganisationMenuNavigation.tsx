import NextLinkComponent from '@components/layout/link/NextLink'
import Menu from '@components/layout/menu'
import { CogIcon, CubeIcon } from '@heroicons/react/outline'
import type { Organisation } from '@prisma/client'
import { routeBuilder } from 'src/client/utils/format'
import { OrganisationNavigationEnum, ZoneNavigationEnum } from 'src/shared/enums'

export const OrganisationMenuNavigation = ({ organisation }: { organisation: Organisation }) => {
  return (
    <div className='relative w-9'>
      <Menu vertical position='bottom-left'>
        <Menu.Items>
          <Menu.Item as={NextLinkComponent} href={routeBuilder(organisation.name, ZoneNavigationEnum.enum.Create)}>
            <CubeIcon className='w-3 h-3' />
            <span>Admin</span>
          </Menu.Item>
          <Menu.Item as={NextLinkComponent} href={routeBuilder(organisation.name, OrganisationNavigationEnum.enum.Settings)}>
            <CogIcon className='w-3 h-3' />
            <span>Settings</span>
          </Menu.Item>
        </Menu.Items>
      </Menu>
    </div>
  )
}
