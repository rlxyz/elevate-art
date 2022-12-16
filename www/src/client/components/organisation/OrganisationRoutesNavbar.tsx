import AvatarComponent from '@components/layout/avatar/Avatar'
import { ZoneRoutesNavbarPopover } from '@components/layout/header/AppRoutesNavbarProps'
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import { env } from 'src/env/client.mjs'

export const OrganisationRoutesNavbarPopover = () => {
  const { current: organisation, all: organisations } = useQueryOrganisationFindAll()

  if (!organisations || !organisation) return null

  return (
    <ZoneRoutesNavbarPopover
      title='Your Teams'
      routes={organisations.map(({ name }) => ({
        label: name,
        href: `/${env.NEXT_PUBLIC_CREATE_CLIENT_BASE_PATH}/${name}`,
        selected: organisation.name === name,
        icon: (props: any) => <AvatarComponent src='/images/avatar-blank.png' />,
      }))}
    />
  )
}
