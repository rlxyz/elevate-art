import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { NextRouter, useRouter } from 'next/router'
import { trpc } from 'src/client/utils/trpc'

export const useQueryRepositoryContractDeployment = () => {
  const router: NextRouter = useRouter()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const deploymentName: string = router.query.deployment as string
  const { data, isLoading, isError } = trpc.repository.findContractDeploymentByName.useQuery(
    { repositoryId, name: deploymentName },
    { enabled: !!repositoryId }
  )
  return { all: data, isLoading, isError }
}
