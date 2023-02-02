import useRepositoryStore from '@hooks/store/useRepositoryStore'
import type { ContractDeploymentAllowlistType } from '@prisma/client'
import type { NextRouter } from 'next/router'
import { useRouter } from 'next/router'
import { trpc } from 'src/client/utils/trpc'

export const useQueryContractDeploymentWhitelist = ({ type }: { type: ContractDeploymentAllowlistType }) => {
  const router: NextRouter = useRouter()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const deploymentName: string = router.query.deployment as string
  const { data, isLoading, isError } = trpc.contractDeploymentWhitelist.findAllowlistByDeployment.useQuery(
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
    all: data?.sort((a, b) => b.mint - a.mint),
    isLoading,
    isError,
  }
}
