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
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await ctx.cancelQuery(['layers.getAll', { id: repositoryId }])

      // Snapshot the previous value
      const backup = ctx.getQueryData(['layers.getAll', { id: repositoryId }])
      if (!backup) return { backup }

      // Optimistically update to the new value
      const next = produce(backup, (draft) => {
        const index = draft.findIndex((layer) => layer.id === variables.layerElementId)
        draft.splice(index, 1)
        draft = draft.map((x) => {
          if (x.priority > data.priority) {
            x.priority = x.priority - 1
          }
          return x
        })
      })

      // Notify
      notifySuccess('Layer deleted successfully')

      // Save
      ctx.setQueryData(['layers.getAll', { id: repositoryId }], next)
    },
  })
}
