import { OrganisationDatabaseEnum, OrganisationDatabaseType } from '@elevateart/db/enums'
import { useQueryOrganisation } from '@hooks/query/useQueryOrganisation'
import useOrganisationNavigationStore from '@hooks/store/useOrganisationNavigationStore'
import { useAuthenticated } from '@hooks/utils/useAuthenticated'
import { useRouter } from 'next/router'
import { ReactNode, useEffect } from 'react'

export const OrganisationAuthLayout = ({
  children,
  type = OrganisationDatabaseEnum.enum.Team,
}: {
  children: ReactNode
  type?: OrganisationDatabaseType
}) => {
  const { isLoggedIn, session } = useAuthenticated()
  const router = useRouter()
  const organisationName = router.query.organisation as string
  const { all: organisations, isLoading, isError } = useQueryOrganisation()
  const { setOrganisationId } = useOrganisationNavigationStore((state) => {
    return {
      setOrganisationId: state.setOrganisationId,
    }
  })

  useEffect(() => {
    if (organisations && organisations.length > 0) {
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
