import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { useNotification } from '@hooks/utils/useNotification'
import { useRepositoryRoute } from '@hooks/utils/useRepositoryRoute'
import { AssetDeploymentBranch } from '@prisma/client'
import produce from 'immer'
import { toPascalCaseWithSpace } from 'src/client/utils/format'
import { trpc } from 'src/client/utils/trpc'

export const useMutateRepositoryDeploymentPromote = () => {
  const ctx = trpc.useContext()
  const { notifySuccess, notifyError } = useNotification()
  const { organisationName, repositoryName } = useRepositoryRoute()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  return trpc.repository.promoteAssetDeployment.useMutation({
    onSuccess: (data, variables) => {
      ctx.repository.findAllAssetDeployments.setData({ repositoryId }, (old) => {
        if (!old) return old
        const next = produce(old, (draft) => {
          const x = draft.find((deployment) => deployment.id === variables.deploymentId)
          if (!x) return
          x.branch = AssetDeploymentBranch.PRODUCTION

          const old = draft.find((deployment) => deployment.id === data.oldProductionDeployment?.id)
          if (!old) return
          old.branch = AssetDeploymentBranch.PREVIEW
        })
        notifySuccess(`You have promoted a deployment to ${toPascalCaseWithSpace(AssetDeploymentBranch.PRODUCTION)}`)
        return next
      })
      // refetch the production deployment
      ctx.contractDeployment.findProductionContract.refetch({
        organisationName,
        repositoryName,
      })
    },
    onError: (err) => {
      notifyError(err.message)
    },
  })
}
