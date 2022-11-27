import { useQueryOrganisationFindAll } from '@hooks/trpc/organisation/useQueryOrganisationFindAll'
import { useRouter } from 'next/router'
import { ReactNode, useEffect } from 'react'
import useOrganisationNavigationStore from 'src/client/hooks/store/useOrganisationNavigationStore'
import { useAuthenticated } from 'src/client/hooks/utils/useAuthenticated'
import {
  OrganisationDatabaseEnum,
  OrganisationDatabaseType,
  OrganisationNavigationEnum,
  OrganisationNavigationType,
} from 'src/shared/enums'

export const OrganisationAuthLayout = ({
  children,
  type = OrganisationDatabaseEnum.enum.Team,
  route = OrganisationNavigationEnum.enum.Dashboard,
}: {
  children: ReactNode
  route?: OrganisationNavigationType
  type?: OrganisationDatabaseType
}) => {
  const { isLoggedIn, session } = useAuthenticated()
  const router = useRouter()
  const organisationName = router.query.organisation as string
  const { all: organisations, isLoading } = useQueryOrganisationFindAll()
  const setOrganisationId = useOrganisationNavigationStore((state) => state.setOrganisationId)
  const setCurrentRoute = useOrganisationNavigationStore((state) => state.setCurrentRoute)

  useEffect(() => {
    setCurrentRoute(route)
  }, [])

  useEffect(() => {
    if (isLoggedIn && organisations && organisations.length > 0) {
      switch (isLoading) {
        case true:
          return
        case false:
          if (type === OrganisationDatabaseEnum.enum.Team) {
            const organisation = organisations?.find((o) => o.name === organisationName)
            if (organisation) {
              setOrganisationId(organisation.id)
              return
            }
          } else if (type === OrganisationDatabaseEnum.enum.Personal) {
            const organisation = organisations?.find((o) => o.type === OrganisationDatabaseEnum.enum.Personal)
            if (organisation) {
              setOrganisationId(organisation.id)
              return
            }
          }
          router.push('/404')
          return
      }
    }
  }, [isLoading])

  if (isLoggedIn) {
    return <>{children}</>
  }

  return null
}
