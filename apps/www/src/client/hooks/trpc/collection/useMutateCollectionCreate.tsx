import type { Collection } from '@prisma/client'
import produce from 'immer'
import useRepositoryStore from 'src/client/hooks/store/useRepositoryStore'
import { useNotification } from 'src/client/hooks/utils/useNotification'
import { trpc } from 'src/client/utils/trpc'
import { CollectionDatabaseEnum } from 'src/shared/enums'
import { useQueryCollectionFindAll } from './useQueryCollectionFindAll'

export const useMutateCollectionCreate = ({ onMutate }: { onMutate?: () => void }) => {
  const ctx = trpc.useContext()
  const { mutate } = useQueryCollectionFindAll({})
  const { notifySuccess } = useNotification()
  const { repositoryId, setCollectionId } = useRepositoryStore((state) => {
    return {
      repositoryId: state.repositoryId,
      setCollectionId: state.setCollectionId,
    }
  })

  return trpc.collection.create.useMutation({
    // Optimistic Update
    onMutate: async (input) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await ctx.collection.findAll.cancel({ repositoryId })

      // Snapshot the previous value
      const backup = ctx.collection.findAll.getData({ repositoryId })
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
      ctx.collection.findAll.setData({ repositoryId }, next)
      return { backup }
    },
    onError: (err, variables, context) => {
      if (!context?.backup) return
      ctx.collection.findAll.setData({ repositoryId }, context.backup)
    },
    onSettled: () => ctx.collection.findAll.invalidate({ repositoryId }),
    onSuccess: async (data, variables) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await ctx.collection.findAll.cancel({ repositoryId })

      // Snapshot the previous value
      const backup = ctx.collection.findAll.getData({ repositoryId })
      if (!backup) return { backup }

      // Optimistically update to the new value
      const next = produce(backup, (draft) => {
        const c = draft.find((c) => c.id === `${repositoryId}-${c.name}`)
        if (c) c.id = data.id
      })

      setCollectionId(data.id)
      ctx.collection.findAll.setData({ repositoryId }, next)
      return { backup }
    },
  })
}
