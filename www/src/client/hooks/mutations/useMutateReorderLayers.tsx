import produce from 'immer'
import useRepositoryStore from 'src/client/hooks/store/useRepositoryStore'
import { useNotification } from 'src/client/hooks/utils/useNotification'
import { trpc } from 'src/client/utils/trpc'

export const useMutateReorderLayers = () => {
  const ctx = trpc.useContext()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const { notifySuccess, notifyError } = useNotification()
  return trpc.layerElement.updateOrder.useMutation({
    onSuccess: async (data, variable) => {
      // Snapshot the previous value
      const backup = ctx.layerElement.findAll.getData({ repositoryId })
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
      ctx.layerElement.findAll.setData({ repositoryId }, next)

      // Notify
      notifySuccess(`You have reordered the layers. All collections have been regenerated with the new order.`)
    },
    onError: (err, variables, context) => {
      notifyError('Something went wrong when reordering layers. Try again...')
    },
  })
}
