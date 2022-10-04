import { NextRouter, useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export const useRepositoryRoute = () => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const collectionName: string = (router.query.collection as string) || 'main'
  const repositoryName: string = router.query.repository as string
  const [mainRepositoryHref, setMainRepositoryHref] = useState<null | string>(null)
  useEffect(() => {
    if (Boolean(organisationName) && Boolean(repositoryName)) {
      setMainRepositoryHref(`${organisationName}/${repositoryName}`)
    }
  }, [organisationName, repositoryName])

  return {
    isLoading: mainRepositoryHref === null,
    mainRepositoryHref: mainRepositoryHref,
    collectionName,
  }
}
