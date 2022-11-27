import produce from 'immer'
import useRepositoryStore from 'src/client/hooks/store/useRepositoryStore'
import { useNotification } from 'src/client/hooks/utils/useNotification'
import { trpc } from 'src/client/utils/trpc'
import { groupBy } from 'src/shared/object-utils'
import { useQueryRepositoryLayer } from '../query/useQueryRepositoryLayer'

export const useMutateTraitElementUpdateWeight = () => {
  const ctx = trpc.useContext()
  const { all: layers } = useQueryRepositoryLayer()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const { notifySuccess, notifyError } = useNotification()
  return trpc.traitElement.updateWeight.useMutation({
    onSuccess: (_, variable) => {
      /** Get the Change */
      const { traitElements } = variable

      /** Update the cache */
      ctx.layerElement.findAll.setData({ repositoryId }, (old) =>
        produce(old, (draft) => {
          if (!draft) return

          Object.entries(groupBy(traitElements, (x) => x.layerElementId)).forEach(([layerElementId]) => {
            /** Find the Layer */
            const layer = draft.find((x) => x.id === layerElementId)
            if (!layer) return

            /** Update every element in that Layer */
            traitElements.map((x) => {
              const found = layer.traitElements.find((y) => y.id === x.traitElementId)
              if (found) {
                found.weight = x.weight
                found.updatedAt = new Date()
              }
              return x
            })

            /** Sort the Layer */
            layer.traitElements = layer.traitElements.sort((a, b) => b.weight - a.weight)
          })
        })
      )

      /** Notify Success */
      notifySuccess(`Successfully updated ${layers?.find((l) => l.id === variable.traitElements[0]?.layerElementId)?.name} rarities.`)
    },
    onError: (err, variables, context) => {
      // @todo better error handling
      if (err.shape?.code === -32600) {
        notifyError(err.message)
      } else {
        notifyError('An error occurred while updating the rarities.')
      }
    },
  })
}
