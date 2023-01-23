import type { WhitelistType } from '@prisma/client'
import { useSession } from 'next-auth/react'
import type { NextRouter } from 'next/router'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { trpc } from 'src/client/utils/trpc'
import { useQueryContractDeploymentProduction } from './useQueryContractDeploymentProduction'

const useCurrentContractAddress = () => {
  const [currentAddress, setCurrentAddress] = useState<string | null>(null)
  const router: NextRouter = useRouter()
  const addr: string = router.query.address as string
  const { current } = useQueryContractDeploymentProduction({})

  useEffect(() => {
    if (router.query.address) {
      return setCurrentAddress(addr)
    }
    if (current?.address) {
      return setCurrentAddress(current.address)
    }
  }, [addr, current?.address])

  return { currentAddress }
}

export const useQueryContractDeploymentWhitelistFindClaimByAddress = ({ type }: { type: WhitelistType }) => {
  const { data: session } = useSession()
  const { currentAddress } = useCurrentContractAddress()
  const { data, isLoading, isError } = trpc.contractDeploymentWhitelist.findWhitelistByAddressAndType.useQuery(
    { address: currentAddress || '', type },
    { enabled: !!currentAddress }
  )
  return {
    current: data?.whitelists.find((x) => x.address === session?.user?.address),
    all: data,
    isLoading,
    isError,
  }
}
