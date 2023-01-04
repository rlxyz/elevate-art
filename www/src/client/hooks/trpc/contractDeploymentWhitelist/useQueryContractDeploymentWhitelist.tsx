import useRepositoryStore from '@hooks/store/useRepositoryStore'
import type { WhitelistType } from '@prisma/client'
import type { NextRouter } from 'next/router'
import { useRouter } from 'next/router'
import { trpc } from 'src/client/utils/trpc'

export const useQueryContractDeploymentWhitelist = ({ type }: { type: WhitelistType }) => {
  const router: NextRouter = useRouter()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const deploymentName: string = router.query.deployment as string
  const { data, isLoading, isError } = trpc.contractDeploymentWhitelist.findAllowlistByDeploymentName.useQuery(
    {
      repositoryId,
      name: deploymentName,
      type,
    },
    {
      enabled: !!repositoryId,
    }
  )
  return {
    current: data,
    isLoading,
    isError,
  }
}
