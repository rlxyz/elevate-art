import { useQueryOrganisation } from '@hooks/query/useQueryOrganisation'
import useOrganisationNavigationStore from '@hooks/store/useOrganisationNavigationStore'
import { useAuthenticated } from '@hooks/utils/useAuthenticated'
import { useRouter } from 'next/router'
import { ReactNode, useEffect } from 'react'

export const OrganisationAuthLayout = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn } = useAuthenticated()
  const router = useRouter()
  const organisationName = router.query.organisation as string
  const { all: organisations, current: organisation, isLoading, isError } = useQueryOrganisation()
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
          const organisation = organisations?.find((o) => o.name === organisationName)
          if (organisation) {
            setOrganisationId(organisation.id)
            return
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
