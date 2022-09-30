import { trpc } from '@utils/trpc'
import { NextRouter, useRouter } from 'next/router'
import useRepositoryStore from '../store/useRepositoryStore'
import { useDeepCompareEffect } from '../utils/useDeepCompareEffect'

export const useQueryRepository = () => {
  const router: NextRouter = useRouter()
  const repositoryName: string = router.query.repository as string
  const { data, isLoading, isError } = trpc.useQuery(['repository.getRepositoryByName', { name: repositoryName }])
  const setRepositoryId = useRepositoryStore((state) => state.setRepositoryId)
  useDeepCompareEffect(() => {
    if (!data) return
    setRepositoryId(data.id)
  }, [isLoading])
  return { current: data, isLoading, isError }
}
