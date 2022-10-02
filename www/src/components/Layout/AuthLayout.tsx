import { useQueryOrganisation } from '@hooks/query/useQueryOrganisation'
import useOrganisationNavigationStore from '@hooks/store/useOrganisationNavigationStore'
import { useAuthenticated } from '@hooks/utils/useAuthenticated'
import { useRouter } from 'next/router'
import { ReactNode, useEffect } from 'react'
import { OrganisationNavigationEnum } from 'src/types/enums'

export const AuthLayout = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn } = useAuthenticated()
  const router = useRouter()
  const organisationName = router.query.organisation as string
  const { all: organisations, isLoading } = useQueryOrganisation()
  const { setOrganisationId, setCurrentRoute, currentRoute } = useOrganisationNavigationStore((state) => {
    return {
      organisationId: state.organisationId,
      setOrganisationId: state.setOrganisationId,
      setCurrentRoute: state.setCurrentRoute,
      currentRoute: state.currentRoute,
    }
  })
  useEffect(() => {
    if (isLoading) {
      return
    }
    const organisation = organisations?.find((organisation) => organisation.name === organisationName)
    if (!organisation) {
      router.push('/')
      return
    }
    setOrganisationId(organisation.id)
  }, [isLoading])

  useEffect(() => {
    if (!organisationName) {
      router.push('/404')
      return
    }
    setCurrentRoute(OrganisationNavigationEnum.enum.Dashboard)
  }, [organisationName])

  if (isLoggedIn) {
    return <>{children}</>
  }

  return null
}
