import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { trpc } from '@utils/trpc'
import produce from 'immer'

export const useMutateAddNewLayer = () => {
  const ctx = trpc.useContext()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  return trpc.useMutation('layer.reorderMany', {
    onMutate: async (input) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await ctx.cancelQuery(['repository.getRepositoryLayers', { id: repositoryId }])

      // Snapshot the previous value
      const backup = ctx.getQueryData(['repository.getRepositoryLayers', { id: repositoryId }])
      if (!backup) return { backup }

      const { layerIdsInOrder } = input

      // Optimistically update to the new value
      const next = produce(backup, (draft) => {
        layerIdsInOrder.forEach((id, index) => {
          const layer = draft.find((l) => l.id === id)
          if (layer) {
            layer.priority = index
          }
        })
        draft = draft.sort((a, b) => a.priority - b.priority)
      })

      ctx.setQueryData(['repository.getRepositoryLayers', { id: repositoryId }], next)

      // return backup
      return { backup }
    },
    onSettled: () => ctx.invalidateQueries(['repository.getRepositoryLayers']),
    onError: (err, variables, context) => {
      if (!context?.backup) return
      ctx.setQueryData(['repository.getRepositoryLayers', { id: repositoryId }], context.backup)
    },
  })
}
