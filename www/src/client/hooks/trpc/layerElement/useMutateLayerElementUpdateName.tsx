import produce from 'immer'
import { trpc } from 'src/client/utils/trpc'
import { useMutationContext } from '../useMutationContext'

export const useMutateLayerElementUpdateName = () => {
  const { ctx, repositoryId, notifyError, notifySuccess } = useMutationContext()
  return trpc.layerElement.updateName.useMutation({
    onSuccess: (_, variables) => {
      const { layerElements } = variables
      ctx.layerElement.findAll.setData({ repositoryId }, (old) => {
        if (!old) return old
        const next = produce(old, (draft) => {
          layerElements.forEach(({ layerElementId, name }) => {
            const layer = draft.find((x) => x.id === layerElementId)
            if (!layer) return
            layer.name = name
          })
        })
        notifySuccess(`Successfully renamed layer`)
        return next
      })
    },
    onError: (error) => {
      notifyError('Something went wrong when renaming layer. Try again...')
    },
  })
}
