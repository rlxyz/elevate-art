import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { useNotification } from '@hooks/utils/useNotification'
import type { WhitelistType } from '@prisma/client'
import type { NextRouter } from 'next/router'
import { useRouter } from 'next/router'
import { trpc } from 'src/client/utils/trpc'

export const useMutateContractDeploymentWhitelistCreate = ({ type }: { type: WhitelistType }) => {
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
          type,
        },
        data
      )
      notifySuccess('We have updated the .')
    },
    onError: (err) => {
      notifyError(err.message)
    },
  })
}
