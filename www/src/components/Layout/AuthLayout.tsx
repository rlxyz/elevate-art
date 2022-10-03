import { useQueryOrganisation } from '@hooks/query/useQueryOrganisation'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { useAuthenticated } from '@hooks/utils/useAuthenticated'
import { useRouter } from 'next/router'
import { ReactNode, useEffect } from 'react'
import { OrganisationDatabaseEnum, OrganisationDatabaseType } from 'src/types/enums'

export const OrganisationAuthLayout = ({
  children,
  type = OrganisationDatabaseEnum.enum.Team,
}: {
  children: ReactNode
  type?: OrganisationDatabaseType
}) => {
  const { isLoggedIn } = useAuthenticated()
  const router = useRouter()
  const organisationName = router.query.organisation as string
  const { all: organisations, isLoading, isError } = useQueryOrganisation()
  const { setOrganisationId } = useRepositoryStore((state) => {
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
