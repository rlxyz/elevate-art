import produce from 'immer'
import useRepositoryStore from 'src/client/hooks/store/useRepositoryStore'
import { useNotification } from 'src/client/hooks/utils/useNotification'
import { trpc } from 'src/client/utils/trpc'

export const useMutateRenameLayerElement = () => {
  const ctx = trpc.useContext()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const { notifyError, notifySuccess } = useNotification()
  return trpc.layerElement.updateName.useMutation({
    onSuccess: async (data, variables) => {
      // Snapshot the previous value
      const backup = ctx.layerElement.findAll.getData({ repositoryId })
      if (!backup) return { backup }

      // Optimistically update to the new value
      const next = produce(backup, (draft) => {
        variables.layerElements.forEach(({ layerElementId, name }) => {
          const layer = draft.find((x) => x.id === layerElementId)
          if (!layer) return
          layer.name = name
        })
      })

      // Save
      ctx.layerElement.findAll.setData({ repositoryId }, next)

      // Notify
      notifySuccess(`Successfully renamed layer`)
    },
    onError: (error) => {
      notifyError('Something went wrong...')
    },
  })
}
