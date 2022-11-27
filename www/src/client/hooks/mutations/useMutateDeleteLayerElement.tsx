import produce from 'immer'
import useRepositoryStore from 'src/client/hooks/store/useRepositoryStore'
import { useNotification } from 'src/client/hooks/utils/useNotification'
import { trpc } from 'src/client/utils/trpc'

export const useMutateDeleteLayerElement = () => {
  const ctx = trpc.useContext()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const { notifyError, notifySuccess } = useNotification()
  return trpc.layerElement.delete.useMutation({
    onSuccess: async (data, variables) => {
      // Snapshot the previous value
      const backup = ctx.layerElement.findAll.getData({ repositoryId })
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
      ctx.layerElement.findAll.setData({ repositoryId }, next)
    },
  })
}
