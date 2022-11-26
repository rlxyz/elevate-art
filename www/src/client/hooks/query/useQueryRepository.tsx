import { trpc } from '@utils/trpc'
import { NextRouter, useRouter } from 'next/router'

export const useQueryRepository = () => {
  const router: NextRouter = useRouter()
  const repositoryName: string = router.query.repository as string
  const { data, isLoading, isError } = trpc.useQuery(['repository.getRepositoryByName', { name: repositoryName }])
  return { current: (data && data) || undefined, isLoading, isError }
}
