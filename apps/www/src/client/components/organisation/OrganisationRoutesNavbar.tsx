import AvatarComponent from '@components/layout/avatar/Avatar'
import { ZoneRoutesNavbarPopover } from '@components/layout/header/AppRoutesNavbarProps'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import { routeBuilder } from 'src/client/utils/format'

export const OrganisationRoutesNavbarPopover = () => {
  const { current: organisation, all: organisations } = useQueryOrganisationFindAll()

  if (!organisations || !organisation) return null

  return (
    <ZoneRoutesNavbarPopover
      title='Your Teams'
      routes={organisations.map(({ name }) => ({
        label: name,
        href: routeBuilder(name),
        selected: organisation.name === name,
        icon: (props: any) => <AvatarComponent src='/images/avatar-blank.png' />,
      }))}
    />
  )
}
