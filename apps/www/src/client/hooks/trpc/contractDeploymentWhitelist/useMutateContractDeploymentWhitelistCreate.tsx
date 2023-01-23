import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { useNotification } from '@hooks/utils/useNotification'
import type { NextRouter } from 'next/router'
import { useRouter } from 'next/router'
import { trpc } from 'src/client/utils/trpc'

export const useMutateContractDeploymentWhitelistCreate = () => {
  const ctx = trpc.useContext()
  const { notifySuccess, notifyError } = useNotification()
  const router: NextRouter = useRouter()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const deploymentName: string = router.query.deployment as string
  return trpc.contractDeploymentWhitelist.create.useMutation({
    onSuccess: (data, variables) => {
      ctx.contractDeploymentWhitelist.findAllowlistByDeploymentName.setData(
        {
          repositoryId,
          name: deploymentName,
          type: variables.type,
        },
        data
      )
      notifySuccess(`We have updated the merkle root with ${variables.whitelist.length} addresses`)
    },
    onError: (err) => {
      notifyError(err.message)
    },
  })
}
