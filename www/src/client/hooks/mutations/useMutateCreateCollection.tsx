import { Collection } from '@prisma/client'
import { trpc } from '@utils/trpc'
import produce from 'immer'
import { NextRouter, useRouter } from 'next/router'
import { useQueryRepositoryCollection } from 'src/client/hooks/query/useQueryRepositoryCollection'
import useRepositoryStore from 'src/client/hooks/store/useRepositoryStore'
import { useNotification } from 'src/client/hooks/utils/useNotification'
import { CollectionDatabaseEnum } from 'src/shared/enums'

export const useMutateCreateCollection = ({ onMutate }: { onMutate?: () => void }) => {
  const ctx = trpc.useContext()
  const { mutate } = useQueryRepositoryCollection()
  const router: NextRouter = useRouter()
  const { notifySuccess } = useNotification()
  const { repositoryId, setCollectionId } = useRepositoryStore((state) => {
    return {
      repositoryId: state.repositoryId,
      setCollectionId: state.setCollectionId,
    }
  })
  return trpc.useMutation('collections.create', {
    // Optimistic Update
    onMutate: async (input) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await ctx.cancelQuery(['collections.getAll', { id: repositoryId }])

      // Snapshot the previous value
      const backup = ctx.getQueryData(['collections.getAll', { id: repositoryId }])
      if (!backup) return { backup }

      const collection: Collection = {
        id: `${repositoryId}-${input.name}`,
        name: input.name,
        type: CollectionDatabaseEnum.enum.Development,
        totalSupply: input.totalSupply,
        generations: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        repositoryId,
      }

      // Optimistically update to the new value
      const next = produce(backup, (draft) => {
        draft.push(collection)
      })

      mutate({ collection })
      onMutate && onMutate()
      ctx.setQueryData(['collections.getAll', { id: repositoryId }], next)
      return { backup }
    },
    onError: (err, variables, context) => {
      if (!context?.backup) return
      ctx.setQueryData(['collections.getAll', { id: repositoryId }], context.backup)
    },
    onSettled: () => ctx.invalidateQueries(['collections.getAll', { id: repositoryId }]),
    onSuccess: async (data, variables) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await ctx.cancelQuery(['collections.getAll', { id: repositoryId }])

      // Snapshot the previous value
      const backup = ctx.getQueryData(['collections.getAll', { id: repositoryId }])
      if (!backup) return { backup }

      // Optimistically update to the new value
      const next = produce(backup, (draft) => {
        const c = draft.find((c) => c.id === `${repositoryId}-${c.name}`)
        if (c) c.id = data.id
      })
      setCollectionId(data.id)
      ctx.setQueryData(['collections.getAll', { id: repositoryId }], next)
      return { backup }
    },
  })
}
