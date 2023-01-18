import type { NextRouter } from 'next/router'
import { useRouter } from 'next/router'
import { trpc } from 'src/client/utils/trpc'

export const useQueryContractDeploymentProduction = ({ repositoryName }: { repositoryName?: string | null | undefined }) => {
  const router: NextRouter = useRouter()
  const r: string = repositoryName || (router.query.repository as string)
  const o: string = router.query.organisation as string
  const { data, isLoading, isError, refetch } = trpc.contractDeployment.findProductionContract.useQuery(
    { organisationName: o, repositoryName: r },
    {
      enabled: !!o || !!r,
      onError: (err) => {
        if (err.message === 'No production contract found') {
          router.push('/404')
        }
      },
    }
  )
  return {
    current: data,
    isLoading,
    isError,
    refetch,
  }
}
