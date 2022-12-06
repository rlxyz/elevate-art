import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { useNotification } from '@hooks/utils/useNotification'
import produce from 'immer'
import { trpc } from 'src/client/utils/trpc'

export const useMutateRepositoryDeploymentDelete = () => {
  const ctx = trpc.useContext()
  const { notifySuccess, notifyError } = useNotification()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  return trpc.repository.deleteDeployment.useMutation({
    onSuccess: (data, variables) => {
      ctx.repository.findDeployments.setData({ repositoryId }, (old) => {
        if (!old) return old
        const next = produce(old, (draft) => {
          const index = draft.findIndex((deployment) => deployment.id === data.id)
          if (index === -1) return
          draft.splice(index, 1)
        })
        notifySuccess(`You have delete an existing deployment.`)
        return next
      })
    },
    onError: (err) => {
      notifyError(err.message)
    },
  })
}
