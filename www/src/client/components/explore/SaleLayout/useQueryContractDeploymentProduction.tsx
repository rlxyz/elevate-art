import type { NextRouter } from 'next/router'
import { useRouter } from 'next/router'
import { trpc } from 'src/client/utils/trpc'

export const useQueryContractDeploymentProduction = () => {
  const router: NextRouter = useRouter()
  const { organisation, repository } = router.query as { organisation: string; repository: string }
  const { data, isLoading, isError, refetch } = trpc.contractDeployment.findProductionContract.useQuery(
    { organisationName: organisation, repositoryName: repository },
    { enabled: !!organisation || !!repository }
  )
  return {
    current: data,
    isLoading,
    isError,
    refetch,
  }
}
