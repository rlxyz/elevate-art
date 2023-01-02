import type { NextRouter } from 'next/router'
import { useRouter } from 'next/router'
import { trpc } from 'src/client/utils/trpc'

export const useQueryContractDeployment = () => {
  const router: NextRouter = useRouter()
  const { address } = router.query as { address: string }
  const { data, isLoading, isError } = trpc.contractDeployment.findByAddress.useQuery({ address }, { enabled: !!address })
  return {
    current: data,
    isLoading,
    isError,
  }
}
