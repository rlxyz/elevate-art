import { OrganisationNavigationEnum, OrganisationSettingsNavigationEnum } from '@utils/enums'
import { capitalize } from '@utils/format'
import { Link } from 'src/client/components/layout/Link'
import { useQueryOrganisation } from 'src/client/hooks/query/useQueryOrganisation'
import useOrganisationNavigationStore from 'src/client/hooks/store/useOrganisationNavigationStore'

export const PersonalOrganisationAccountNavigation = () => {
  const { current: organisation, isLoading } = useQueryOrganisation()
  const currentSettingsRoute = useOrganisationNavigationStore((state) => state.currentSettingsRoute)
  return (
    <div>
      {[
        {
          name: OrganisationSettingsNavigationEnum.enum.General,
          href: `/${OrganisationNavigationEnum.enum.Account}`,
        },
      ].map(({ name, href }) => {
        return <Link key={name} href={href} title={capitalize(name)} enabled={currentSettingsRoute === name} />
      })}
    </div>
  )
}
