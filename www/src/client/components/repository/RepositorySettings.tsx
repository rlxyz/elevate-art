import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import { Link } from 'src/client/components/layout/Link'
import useOrganisationNavigationStore from 'src/client/hooks/store/useOrganisationNavigationStore'
import { capitalize } from 'src/client/utils/format'
import { OrganisationNavigationEnum, OrganisationSettingsNavigationEnum } from 'src/shared/enums'

export const RepositorySettingsNavigations = () => {
  const { current: organisation } = useQueryOrganisationFindAll()
  const currentSettingsRoute = useOrganisationNavigationStore((state) => state.currentSettingsRoute)
  return (
    <div>
      {[
        {
          name: OrganisationSettingsNavigationEnum.enum.General,
          href: `/${organisation?.name}/${OrganisationNavigationEnum.enum.Settings}`,
        },
        {
          name: OrganisationSettingsNavigationEnum.enum.Team,
          href: `/${organisation?.name}/${OrganisationNavigationEnum.enum.Settings}/${OrganisationSettingsNavigationEnum.enum.Team}`,
        },
      ].map(({ name, href }) => {
        return <Link key={name} href={href} title={capitalize(name)} enabled={currentSettingsRoute === name} />
      })}
    </div>
  )
}
