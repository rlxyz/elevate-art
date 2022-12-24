import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { useQueryRepositoryFindByName } from '@hooks/trpc/repository/useQueryRepositoryFindByName'
import type { NextRouter } from 'next/router'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { env } from 'src/env/client.mjs'

export const useRepositoryRoute = () => {
  const router: NextRouter = useRouter()
  const organisationName: string = router.query.organisation as string
  const collectionName: string = (router.query.collection as string) || 'main'
  const repositoryName: string = router.query.repository as string
  const deploymentName: string = router.query.deployment as string
  const [mainRepositoryHref, setMainRepositoryHref] = useState<null | string>(null)
  const setRepositoryId = useRepositoryStore((state) => state.setRepositoryId)
  const { current: repository, isLoading: isLoadingRepository } = useQueryRepositoryFindByName()

  useEffect(() => {
    if (!repository) return
    setRepositoryId(repository.id)
  }, [isLoadingRepository])

  useEffect(() => {
    if (Boolean(organisationName) && Boolean(repositoryName)) {
      setMainRepositoryHref(
        `${env.NEXT_PUBLIC_CREATE_CLIENT_BASE_PATH}/${encodeURIComponent(organisationName)}/${encodeURIComponent(repositoryName)}`
      )
    }
  }, [organisationName, repositoryName])

  return {
    isLoading: mainRepositoryHref === null,
    mainRepositoryHref: mainRepositoryHref,
    collectionName,
    organisationName,
    repositoryName,
    deploymentName,
  }
}
