import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { useNotification } from '@hooks/utils/useNotification'
import { trpc } from '@utils/trpc'
import produce from 'immer'

export const useMutateDeleteLayerElement = () => {
  const ctx = trpc.useContext()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const { notifyError, notifySuccess } = useNotification()
  return trpc.useMutation('layers.delete', {
    onSuccess: async (data, variables) => {
      // Notify
      notifySuccess('Layer deleted successfully')

      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await ctx.cancelQuery(['layers.getAll', { id: repositoryId }])

      // Snapshot the previous value
      const backup = ctx.getQueryData(['layers.getAll', { id: repositoryId }])
      if (!backup) return { backup }

      // Optimistically update to the new value
      const next = produce(backup, (draft) => {
        const index = draft.findIndex((l) => l.id === data.id)
        if (!index) {
          return
        }
        // update priority of all layers after the deleted layer
        draft.slice(index).forEach((l) => {
          l.priority = l.priority - 1
        })

        draft = draft.slice(index, 1)
      })

      // Save
      ctx.setQueryData(['layers.getAll', { id: repositoryId }], next)
    },
  })
}
