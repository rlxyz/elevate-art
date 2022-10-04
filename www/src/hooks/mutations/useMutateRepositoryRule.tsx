import { useNotification } from '@hooks/utils/useNotification'
import { trpc } from '@utils/trpc'
import produce from 'immer'

export const useMutateRepositoryRule = ({ onMutate }: { onMutate: () => void }) => {
  const ctx = trpc.useContext()
  const { notifySuccess } = useNotification()
  return trpc.useMutation('repository.createRule', {
    // Optimistic Update
    onMutate: async (input) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await ctx.cancelQuery(['repository.getRepositoryLayers', { id: input.repositoryId }])

      // Snapshot the previous value
      const backup = ctx.getQueryData(['repository.getRepositoryLayers', { id: input.repositoryId }])
      if (!backup) return { backup }

      // Get indexes of the traits
      const primaryId = backup.findIndex((l) => l.id === input.primaryLayerElementId)
      const secondaryId = backup.findIndex((l) => l.id === input.secondaryLayerElementId)
      const primaryTrait = backup[primaryId]?.traitElements.find((t) => t.id === input.primaryTraitElementId)
      const secondaryTrait = backup[secondaryId]?.traitElements.find((t) => t.id === input.secondaryTraitElementId)

      if (typeof primaryTrait === 'undefined' || typeof secondaryTrait === 'undefined') return { backup }

      // Optimistically update to the new value
      const next = produce(backup, (draft) => {
        draft[primaryId]?.traitElements[Number(primaryId)]?.rulesPrimary.push({
          id: 'temp',
          condition: input.type,
          secondaryTraitElementId: input.secondaryTraitElementId,
          primaryTraitElementId: input.primaryTraitElementId,
          secondaryTraitElement: {
            ...secondaryTrait,
            layerElement: {
              id: secondaryTrait.layerElementId,
              name: draft[secondaryId]?.name ?? '',
              priority: draft[secondaryId]?.priority ?? 0,
              repositoryId: draft[secondaryId]?.repositoryId ?? '',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
          primaryTraitElement: {
            ...primaryTrait,
            layerElement: {
              id: primaryTrait.layerElementId,
              name: draft[primaryId]?.name ?? '',
              priority: draft[primaryId]?.priority ?? 0,
              repositoryId: draft[primaryId]?.repositoryId ?? '',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        })
      })

      ctx.setQueryData(['repository.getRepositoryLayers', { id: input.repositoryId }], next)

      // Notify Success
      notifySuccess(
        <div>
          <span className='text-blueHighlight text-semibold'>{primaryTrait?.name || ''}</span>
          <span>{` now ${input.type} `}</span>
          <span className='font-semibold'>{secondaryTrait?.name}</span>
        </div>
      )
      onMutate && onMutate()
      return { backup }
    },
    onError: (err, variables, context) => {
      if (!context?.backup) return
      ctx.setQueryData(['repository.getRepositoryLayers', { id: variables.repositoryId }], context.backup)
    },
    onSettled: () => ctx.invalidateQueries(['repository.getRepositoryLayers']),
  })
}
