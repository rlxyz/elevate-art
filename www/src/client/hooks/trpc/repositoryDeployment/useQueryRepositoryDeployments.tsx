import useRepositoryStore from '@hooks/store/useRepositoryStore'
import type { NextRouter } from 'next/router'
import { useRouter } from 'next/router'
import { trpc } from 'src/client/utils/trpc'

export const useQueryRepositoryDeployments = () => {
  const router: NextRouter = useRouter()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const deploymentName: string = router.query.deployment as string
  const { data, isLoading, isError } = trpc.repository.findDeployments.useQuery({ repositoryId }, { enabled: !!repositoryId })
  return { current: data?.find((x) => x.name === deploymentName), all: data, isLoading, isError }
}
