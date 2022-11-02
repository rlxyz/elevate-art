import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { useNotification } from '@hooks/utils/useNotification'
import { trpc } from '@utils/trpc'
import produce from 'immer'

export const useMutateReorderLayers = () => {
  const ctx = trpc.useContext()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const { notifySuccess, notifyError } = useNotification()
  return trpc.useMutation('layers.reorder', {
    onSuccess: async (data, variable) => {
      // Notify
      notifySuccess(`You have reordered the layers. All collections have been regenerated with the new order.`)

      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await ctx.cancelQuery(['layers.getAll', { id: repositoryId }])

      // Snapshot the previous value
      const backup = ctx.getQueryData(['layers.getAll', { id: repositoryId }])
      if (!backup) return { backup }

      // Optimistically update to the new value
      const next = produce(backup, (draft) => {
        variable.layerIdsInOrder.forEach((id, index) => {
          const layer = draft.find((l) => l.id === id)
          if (layer) {
            layer.priority = index
          }
        })
        draft = draft.sort((a, b) => a.priority - b.priority)
      })

      // Save
      ctx.setQueryData(['layers.getAll', { id: repositoryId }], next)
    },
    onError: (err, variables, context) => {
      notifyError('Something went wrong when reordering layers. Try again...')
    },
  })
}
