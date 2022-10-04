import { useNotification } from '@hooks/utils/useNotification'
import { trpc } from '@utils/trpc'
import produce from 'immer'
import { useQueryRepositoryLayer } from '../query/useQueryRepositoryLayer'

export const useMutateRepositoryLayersWeight = ({ onMutate }: { onMutate?: () => void }) => {
  const ctx = trpc.useContext()
  const { all: layers, isLoading } = useQueryRepositoryLayer()
  const { notifySuccess } = useNotification()
  return trpc.useMutation('repository.updateLayer', {
    // Optimistic Update
    onMutate: async (input) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await ctx.cancelQuery(['repository.getRepositoryLayers', { id: input.repositoryId }])

      // Snapshot the previous value
      const backup = ctx.getQueryData(['repository.getRepositoryLayers', { id: input.repositoryId }])
      if (!backup) return { backup }

      // Optimistically update to the new value
      const next = produce(backup, (draft) => {
        const layer = draft.find((l) => l.id === input.layerId)
        if (typeof layer === 'undefined') return
        layer.traitElements =
          layer.traitElements
            .map((trait) => {
              return produce(trait, (draft) => {
                draft.weight = input.traits.find((t) => t.id === trait.id)?.weight || 0
                draft.updatedAt = new Date()
              })
            })
            .sort((a, b) => a.weight - b.weight) || []
      })
      ctx.setQueryData(['repository.getRepositoryLayers', { id: input.repositoryId }], next)
      onMutate && onMutate()
      // return backup
      return { backup }
    },
    onError: (err, variables, context) => {
      if (!context?.backup) return
      ctx.setQueryData(['repository.getRepositoryLayers', { id: variables.repositoryId }], context.backup)
    },
    onSettled: () => ctx.invalidateQueries(['repository.getRepositoryLayers']),
    onSuccess: (data, variables) => {
      notifySuccess(`Successfully updated ${layers?.find((l) => l.id === variables.layerId)?.name} rarities`)
    },
  })
}
