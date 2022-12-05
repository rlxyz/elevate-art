import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { NextRouter, useRouter } from 'next/router'
import { trpc } from 'src/client/utils/trpc'

export const useQueryRepositoryDeployments = () => {
  const router: NextRouter = useRouter()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const { data, isLoading, isError } = trpc.repository.findDeployments.useQuery({ repositoryId }, { enabled: !!repositoryId })
  return { all: data, isLoading, isError }
}
