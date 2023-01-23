import type { NextRouter } from 'next/router'
import { useRouter } from 'next/router'
import { trpc } from 'src/client/utils/trpc'

export const useQueryRepositoryFindByName = (
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
  const { data, isLoading, isError } = trpc.repository.findByName.useQuery(
    {
      repositoryName: r,
      organisationName: o,
    },
    { enabled: !!r && !!o }
  )
  return { current: (data && data) || undefined, isLoading, isError }
}
