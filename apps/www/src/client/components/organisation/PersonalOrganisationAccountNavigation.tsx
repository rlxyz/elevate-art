import { Link } from 'src/client/components/layout/Link'
import useOrganisationNavigationStore from 'src/client/hooks/store/useOrganisationNavigationStore'
import { capitalize, routeBuilder } from 'src/client/utils/format'
import { OrganisationNavigationEnum, OrganisationSettingsNavigationEnum } from 'src/shared/enums'

export const PersonalOrganisationAccountNavigation = () => {
  const currentSettingsRoute = useOrganisationNavigationStore((state) => state.currentSettingsRoute)
  return (
    <div>
      {[
        {
          name: OrganisationSettingsNavigationEnum.enum.General,
          href: routeBuilder(OrganisationNavigationEnum.enum.Dashboard, OrganisationNavigationEnum.enum.Account),
        },
      ].map(({ name, href }) => {
        return <Link key={name} href={href} title={capitalize(name)} enabled={currentSettingsRoute === name} />
      })}
    </div>
  )
}
