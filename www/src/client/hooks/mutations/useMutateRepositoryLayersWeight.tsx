import produce from 'immer'
import useRepositoryStore from 'src/client/hooks/store/useRepositoryStore'
import { useNotification } from 'src/client/hooks/utils/useNotification'
import { trpc } from 'src/client/utils/trpc'
import { groupBy } from 'src/shared/object-utils'
import { useQueryRepositoryLayer } from '../query/useQueryRepositoryLayer'

export const useMutateRepositoryLayersWeight = () => {
  const ctx = trpc.useContext()
  const { all: layers, isLoading } = useQueryRepositoryLayer()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const { notifySuccess } = useNotification()
  return trpc.traitElement.updateWeight.useMutation({
    // Optimistic Update
    onMutate: async (input) => {
      const { traitElements } = input

      // Snapshot the previous value
      const backup = ctx.layerElement.findAll.getData({ repositoryId })
      if (!backup) return { backup }

      const allLayers = groupBy(traitElements, (x) => x.layerElementId)

      // Optimistically update to the new value
      const next = produce(backup, (draft) => {
        Object.entries(allLayers).forEach(([layerElementId, traitElement]) => {
          /** Find the Layer */
          const layer = draft.find((x) => x.id === layerElementId)
          if (!layer) return

          /** Update every element in that Layer */
          traitElements.map((x) => {
            const found = layer.traitElements.find((y) => y.id === x.traitElementId)
            if (found) {
              found.weight = x.weight
              found.createdAt = new Date()
            }
            return x
          })

          /** Sort the Layer */
          layer.traitElements = layer.traitElements.sort((a, b) => b.weight - a.weight)
        })
      })

      ctx.layerElement.findAll.setData({ repositoryId }, next)
      return { backup }
    },
    onError: (err, variables, context) => {
      if (!context?.backup) return
      ctx.layerElement.findAll.setData({ repositoryId }, context.backup)
    },
    onSuccess: (data, variable) => {
      notifySuccess(`Successfully updated ${layers?.find((l) => l.id === variable.traitElements[0]?.layerElementId)?.name} rarities.`)
    },
    onSettled: () => ctx.layerElement.findAll.invalidate({ repositoryId }),
  })
}
