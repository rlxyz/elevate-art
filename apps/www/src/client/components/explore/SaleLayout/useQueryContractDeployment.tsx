import type { NextRouter } from 'next/router'
import { useRouter } from 'next/router'
import { trpc } from 'src/client/utils/trpc'

export const useQueryContractDeployment = ({ address: addr = '' }: { address?: string | null | undefined }) => {
  const router: NextRouter = useRouter()
  const address = (router.query.address as string) || addr
  console.log('addr', address)
  const { data, isLoading, isError } = trpc.contractDeployment.findByAddress.useQuery({ address: address || '' }, { enabled: !!address })
  return {
    current: data,
    isLoading,
    isError,
  }
}
