import { Link } from '@components/Layout/Link'
import { useQueryOrganisation } from '@hooks/query/useQueryOrganisation'
import useOrganisationNavigationStore from '@hooks/store/useOrganisationNavigationStore'
import { capitalize } from '@utils/format'
import { OrganisationNavigationEnum, OrganisationSettingsNavigationEnum } from 'src/types/enums'

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
