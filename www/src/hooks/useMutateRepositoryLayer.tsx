import { trpc } from '@utils/trpc'
import produce from 'immer'
import { useNotification } from './useNotification'
import useRepositoryStore from './useRepositoryStore'

export const useQueryRepositoryLayer = () => {
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  return trpc.useQuery(['repository.getRepositoryLayers', { id: repositoryId }])
}

export const useQueryCollection = () => {
  const collectionId = useRepositoryStore((state) => state.collectionId)
  return trpc.useQuery(['collection.getCollectionById', { id: collectionId }])
}

export const useMutateRepositoryLayer = () => {
  const ctx = trpc.useContext()
  const { data: layers } = useQueryRepositoryLayer()
  const { notifySuccess } = useNotification()
  return trpc.useMutation('repository.updateLayer', {
    // Optimistic Update
    onMutate: async (input) => {
      const { repositoryId, layerId } = input
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await ctx.cancelQuery(['repository.getRepositoryLayers', { id: repositoryId }])

      // Snapshot the previous value
      const backup = ctx.getQueryData(['repository.getRepositoryLayers', { id: repositoryId }])

      // Optimistically update to the new value
      if (backup) {
        const next = produce(backup, (draft) => {
          const id = draft.findIndex((l) => l.id === layerId)
          draft[id].traitElements = draft[id]?.traitElements
            .map((trait) => {
              return produce(trait, (draft) => {
                draft.weight = input.traits.find((t) => t.id === trait.id)?.weight || 0
                draft.updatedAt = new Date()
              })
            })
            .sort((a, b) => a.weight - b.weight)
        })
        ctx.setQueryData(['repository.getRepositoryLayers', { id: repositoryId }], next)
      }
      return { backup }
    },
    onError: (err, variables, context) => {
      if (!context?.backup) return
      ctx.setQueryData(['repository.getRepositoryLayers', { id: variables.repositoryId }], context.backup)
    },
    onSettled: () => ctx.invalidateQueries(['repository.getRepositoryLayers']),
    onSuccess: (data, variables) => {
      notifySuccess(
        <div>
          <span>{`Successfully updated `}</span>
          <span className='text-blueHighlight text-semibold'>
            {layers?.find((l) => l.id === variables.layerId)?.name}
          </span>
          <span className='font-semibold'>{` rarities`}</span>
        </div>,
        'rarity changed'
      )
    },
  })
}
