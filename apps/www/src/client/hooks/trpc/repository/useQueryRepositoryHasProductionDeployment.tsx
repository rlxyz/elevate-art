import type { NextRouter } from 'next/router'
import { useRouter } from 'next/router'
import { trpc } from 'src/client/utils/trpc'

export const useQueryRepositoryHasProductionDeployment = (
  {
    organisationName,
    repositoryName,
  }: {
    organisationName?: string
    repositoryName?: string
  } = { organisationName: '', repositoryName: '' }
) => {
  const router: NextRouter = useRouter()
  const r: string = repositoryName || (router.query.repository as string)
  const o: string = organisationName || (router.query.organisation as string)
  const { data, isLoading, isError } = trpc.repository.hasProductionDeployment.useQuery(
    {
      repositoryName: r,
      organisationName: o,
    },
    { enabled: !!r && !!o }
  )
  return { current: data || undefined, isLoading, isError }
}
