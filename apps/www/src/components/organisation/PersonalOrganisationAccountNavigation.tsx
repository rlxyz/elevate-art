import { Link } from "@elevateart/ui"
import { OrganisationNavigationEnum, OrganisationSettingsNavigationEnum } from "@utils/enums"
import { capitalize } from "src/utils/format"

export const PersonalOrganisationAccountNavigation = () => {
  return (
    <div>
      {[
        {
          name: OrganisationSettingsNavigationEnum.enum.General,
          href: `/${OrganisationNavigationEnum.enum.Account}`,
        },
      ].map(({ name, href }) => {
        return (
          <Link block key={name} href={href} className='text-xs'>
            <span>{capitalize(name)}</span>
          </Link>
        )
      })}
    </div>
  )
}
