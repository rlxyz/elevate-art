import type { NextRouter } from 'next/router'
import { useRouter } from 'next/router'
import { trpc } from 'src/client/utils/trpc'

export const useQueryRepositoryDeployments = () => {
  const router: NextRouter = useRouter()
  const { organisation: organisationName, repository: repositoryName } = router.query as { organisation: string; repository: string }
  const { data, isLoading, isError } = trpc.repository.findDeployments.useQuery(
    { organisationName, repositoryName },
    { enabled: !!(organisationName || repositoryName) }
  )
  return { current: data, isLoading, isError }
}
