import produce from 'immer'
import { trpc } from 'src/client/utils/trpc'
import { groupBy } from 'src/shared/object-utils'
import { useMutationContext } from '../useMutationContext'

export const useMutateTraitElementDelete = () => {
  const { ctx, repositoryId, notifyError, notifySuccess } = useMutationContext()
  return trpc.traitElement.delete.useMutation({
    onSuccess: (_, variable) => {
      ctx.layerElement.findAll.setData({ repositoryId }, (old) => {
        if (!old) return old
        const next = produce(old, (draft) => {
          Object.entries(groupBy(variable.traitElements, (x) => x.layerElementId)).map(([layerElementId, traitElements]) => {
            const layer = draft.find((l) => l.id === layerElementId)
            if (!layer) return
            const ids = traitElements.map((x) => x.id)
            layer.traitElements = layer.traitElements.filter((x) => !ids.includes(x.id))
          })
        })
        notifySuccess(`You have delete ${variable.traitElements.length} traits.`)
        return next
      })
    },
    onError: (err, variables, context) => {
      notifyError('Something went wrong when deleting the traits. Try again...')
    },
  })
}
