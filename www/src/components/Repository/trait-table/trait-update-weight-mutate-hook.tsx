import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { useNotification } from '@hooks/utils/useNotification'
import { groupBy } from '@utils/object-utils'
import { trpc } from '@utils/trpc'
import produce from 'immer'
import { useQueryRepositoryLayer } from '../../../hooks/query/useQueryRepositoryLayer'

export const useMutateRepositoryLayersWeight = () => {
  const ctx = trpc.useContext()
  const { all: layers, isLoading } = useQueryRepositoryLayer()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const { notifySuccess } = useNotification()
  return trpc.useMutation('traits.update.weight', {
    // Optimistic Update
    onMutate: async (input) => {
      const { traitElements } = input

      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await ctx.cancelQuery(['layers.getAll', { id: repositoryId }])

      // Snapshot the previous value
      const backup = ctx.getQueryData(['layers.getAll', { id: repositoryId }])
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

      ctx.setQueryData(['layers.getAll', { id: repositoryId }], next)
      return { backup }
    },
    onError: (err, variables, context) => {
      if (!context?.backup) return
      ctx.setQueryData(['layers.getAll', { id: repositoryId }], context.backup)
    },
    onSuccess: (data, variable) => {
      // return backup
      notifySuccess(
        `Successfully updated ${layers?.find((l) => l.id === variable.traitElements[0]?.layerElementId)?.name} rarities.`
      )
    },
    onSettled: () => ctx.invalidateQueries(['layers.getAll', { id: repositoryId }]),
  })
}
