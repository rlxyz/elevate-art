import { useSession } from 'next-auth/react'
import type { NextRouter } from 'next/router'
import { useRouter } from 'next/router'
import { trpc } from 'src/client/utils/trpc'

export const useQueryContractDeploymentWhitelistFindClaimByAddress = () => {
  const router: NextRouter = useRouter()
  const session = useSession()
  const { address } = router.query as { address: string }
  const { data, isLoading, isError } = trpc.assetDeploymentWhitelist.findClaimByAddress.useQuery({ address }, { enabled: !!address })
  return {
    current: data?.whitelists.find((x) => x.address === session?.data?.user?.address) || { address: session?.data?.user?.address, mint: 0 },
    all: data,
    isLoading,
    isError,
  }
}
