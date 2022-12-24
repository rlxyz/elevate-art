import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { useNotification } from '@hooks/utils/useNotification'
import produce from 'immer'
import { trpc } from 'src/client/utils/trpc'

export const useMutateRepositoryDeploymentCreate = () => {
  const ctx = trpc.useContext()
  const { notifySuccess, notifyError } = useNotification()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  return trpc.repository.createAssetDeployment.useMutation({
    onSuccess: (data, variables) => {
      ctx.repository.findAllAssetDeployments.setData({ repositoryId }, (old) => {
        if (!old) return old
        const next = produce(old, (draft) => {
          draft.unshift(data)
        })
        notifySuccess(`You have created a new deployment.`)
        return next
      })
    },
    onError: (err) => {
      notifyError(err.message)
    },
  })
}
