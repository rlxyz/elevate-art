import { useQueryRepositoryCollection } from '@hooks/query/useQueryRepositoryCollection'
import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { useNotification } from '@hooks/utils/useNotification'
import { trpc } from '@utils/trpc'
import produce from 'immer'

export const useMutateGenerationIncrement = ({ onMutate }: { onMutate?: () => void }) => {
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const { mutate } = useQueryRepositoryCollection()
  const ctx = trpc.useContext()
  const { notifySuccess } = useNotification()
  return trpc.useMutation('collections.updateGeneration', {
    // Optimistic Update
    onMutate: async (input) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await ctx.cancelQuery(['repository.getRepositoryCollections', { id: repositoryId }])

      // Snapshot the previous value
      const backup = ctx.getQueryData(['repository.getRepositoryCollections', { id: repositoryId }])
      if (!backup) return { backup }

      // Optimistically update to the new value
      const next = produce(backup, (draft) => {
        const collection = draft.find((c) => c.id === input.id)
        if (!collection) return
        collection.generations = collection?.generations + 1
      })

      const collection = next.find((c) => c.id === input.id)
      if (collection) mutate({ collection })
      ctx.setQueryData(['repository.getRepositoryCollections', { id: repositoryId }], next)

      onMutate && onMutate()
      notifySuccess(`Successfully generated a new collection!`)
      return { backup }
    },
    onError: (err, variables, context) => {
      if (!context?.backup) return
      ctx.setQueryData(['repository.getRepositoryCollections', { id: repositoryId }], context.backup)
    },
    onSettled: () => ctx.invalidateQueries(['repository.getRepositoryCollections', { id: repositoryId }]),
  })
}
