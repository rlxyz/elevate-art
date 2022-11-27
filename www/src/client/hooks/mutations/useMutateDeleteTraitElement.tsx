import produce from 'immer'
import useRepositoryStore from 'src/client/hooks/store/useRepositoryStore'
import { useNotification } from 'src/client/hooks/utils/useNotification'
import { trpc } from 'src/client/utils/trpc'
import { groupBy } from 'src/shared/object-utils'

export const useMutateDeleteTraitElement = () => {
  const ctx = trpc.useContext()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const { notifySuccess, notifyError } = useNotification()
  return trpc.traitElement.delete.useMutation({
    onSuccess: (data, variable) => {
      const backup = ctx.layerElement.findAll.getData({ repositoryId })
      if (!backup) return

      /** Update State */
      const next = produce(backup, (draft) => {
        Object.entries(groupBy(variable.traitElements, (x) => x.layerElementId)).map(([layerElementId, traitElements]) => {
          const layer = draft.find((l) => l.id === layerElementId)
          if (!layer) return
          const ids = traitElements.map((x) => x.id)
          layer.traitElements = layer.traitElements.filter((x) => !ids.includes(x.id))
        })
      })

      ctx.layerElement.findAll.setData({ repositoryId }, next)

      notifySuccess(`You have delete ${variable.traitElements.length} traits.`)
    },
    onError: (err, variables, context) => {
      notifyError('Something went wrong when deleting the traits')
    },
  })
}
