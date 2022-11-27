import produce from 'immer'
import useRepositoryStore from 'src/client/hooks/store/useRepositoryStore'
import { useNotification } from 'src/client/hooks/utils/useNotification'
import { trpc } from 'src/client/utils/trpc'

export const useMutateLayerElementUpdateName = () => {
  const ctx = trpc.useContext()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const { notifyError, notifySuccess } = useNotification()
  return trpc.layerElement.updateName.useMutation({
    onSuccess: async (data, variables) => {
      /** Get the Change */
      const { layerElements } = variables

      /** Update the cache */
      ctx.layerElement.findAll.setData({ repositoryId }, (old) =>
        produce(old, (draft) => {
          if (!draft) return

          layerElements.forEach(({ layerElementId, name }) => {
            const layer = draft.find((x) => x.id === layerElementId)
            if (!layer) return
            layer.name = name
          })
        })
      )

      /** Notify Success */
      notifySuccess(`Successfully renamed layer`)
    },
    onError: (error) => {
      notifyError('Something went wrong...')
    },
  })
}
