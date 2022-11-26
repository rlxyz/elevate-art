import { trpc } from '@utils/trpc'
import produce from 'immer'
import useRepositoryStore from 'src/client/hooks/store/useRepositoryStore'
import { useNotification } from 'src/client/hooks/utils/useNotification'

export const useMutateReorderLayers = () => {
  const ctx = trpc.useContext()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const { notifySuccess, notifyError } = useNotification()
  return trpc.useMutation('layers.update.order', {
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
        variable.layerElements.forEach(({ layerElementId: id, priority }) => {
          const layer = draft.find((l) => l.id === id)
          if (layer) {
            layer.priority = priority
          }
        })
        // @todo this seems unsafe; we should depend on server for sorting
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
