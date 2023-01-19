import produce from 'immer'
import { trpc } from 'src/client/utils/trpc'
import { useMutationContext } from '../useMutationContext'

export const useMutateLayerElementCreate = () => {
  const { ctx, repositoryId, notifyError, notifySuccess } = useMutationContext()
  return trpc.layerElement.create.useMutation({
    onSuccess: (data) => {
      ctx.layerElement.findAll.setData({ repositoryId }, (old) => {
        if (!old) return old
        const next = produce(old, (draft) => {
          draft.push({
            ...data,
            traitElements: [],
          })
        })
        notifySuccess(`You have created a new layer called ${data.name}.`)
        return next
      })
    },
    onError: (err) => {
      notifyError(err.message)
    },
  })
}
