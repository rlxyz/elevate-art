<<<<<<<< HEAD:apps/www/src/components/Organisation/PersonalOrganisationAccountNavigation.tsx
import { useQueryOrganisation } from '@hooks/query/useQueryOrganisation'
import Link from '@components/Layout/Link'
import useOrganisationNavigationStore from '@hooks/store/useOrganisationNavigationStore'
import { capitalize } from '@utils/format'
import { OrganisationNavigationEnum, OrganisationSettingsNavigationEnum } from 'src/types/enums'
========
import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import { Link } from 'src/client/components/layout/Link'
import useOrganisationNavigationStore from 'src/client/hooks/store/useOrganisationNavigationStore'
import { capitalize } from 'src/client/utils/format'
import { OrganisationNavigationEnum, OrganisationSettingsNavigationEnum } from 'src/shared/enums'
>>>>>>>> staging:apps/www/src/client/components/organisation/PersonalOrganisationAccountNavigation.tsx

export const PersonalOrganisationAccountNavigation = () => {
  const { current: organisation, isLoading } = useQueryOrganisationFindAll()
  const currentSettingsRoute = useOrganisationNavigationStore((state) => state.currentSettingsRoute)
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
