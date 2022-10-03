import { useQueryOrganisation } from '@hooks/query/useQueryOrganisation'
import useOrganisationNavigationStore from '@hooks/store/useOrganisationNavigationStore'
import { useAuthenticated } from '@hooks/utils/useAuthenticated'
import { useRouter } from 'next/router'
import { ReactNode, useEffect } from 'react'

export const AuthLayout = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn } = useAuthenticated()
  const router = useRouter()
  const organisationName = router.query.organisation as string
  const repositoryName = router.query.repositoryName as string
  const { all: organisations, isLoading } = useQueryOrganisation()
  const { setOrganisationId } = useOrganisationNavigationStore((state) => {
    return {
      setOrganisationId: state.setOrganisationId,
    }
  })

  useEffect(() => {
    if (isLoading) {
      return
    }
    if (!organisations) {
      return
    }
    const organisation = organisations?.find((organisation) => organisation.name === organisationName)
    if (!organisation) {
      router.push('/')
      return
    }
    setOrganisationId(organisation.id)
  }, [isLoading])

  // useEffect(() => {
  //   if (!organisationName) {
  //     router.push('/404')
  //     return
  //   }
  // }, [organisationName])

  if (isLoggedIn) {
    return <>{children}</>
  }

  return null
}
