import { useQueryRepositoryCollection } from '@hooks/router/collection/useQueryRepositoryCollection'
import produce from 'immer'
import useRepositoryStore from 'src/client/hooks/store/useRepositoryStore'
import { useNotification } from 'src/client/hooks/utils/useNotification'
import { trpc } from 'src/client/utils/trpc'

export const useMutateGenerationIncrement = ({ onMutate }: { onMutate?: () => void }) => {
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const { mutate } = useQueryRepositoryCollection()
  const ctx = trpc.useContext()
  const { notifySuccess } = useNotification()
  return trpc.collection.updateGeneration.useMutation({
    // Optimistic Update
    onMutate: async (input) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await ctx.collection.findAll.cancel({ repositoryId })

      // Snapshot the previous value
      const backup = ctx.collection.findAll.getData({ repositoryId })
      if (!backup) return { backup }

      // Optimistically update to the new value
      const next = produce(backup, (draft) => {
        const collection = draft.find((c) => c.id === input.collectionId)
        if (!collection) return
        collection.generations = collection?.generations + 1
      })

      const collection = next.find((c) => c.id === input.collectionId)
      if (collection) mutate({ collection })
      ctx.collection.findAll.setData({ repositoryId }, next)

      onMutate && onMutate()
      notifySuccess(`Successfully generated a new collection!`)
      return { backup }
    },
    onError: (err, variables, context) => {
      if (!context?.backup) return
      ctx.collection.findAll.setData({ repositoryId }, context.backup)
    },
    onSettled: () => ctx.collection.findAll.invalidate({ repositoryId }),
  })
}
