import { trpc } from '@utils/trpc'
import produce from 'immer'
import { NextRouter, useRouter } from 'next/router'
import { useNotification } from './useNotification'
import useRepositoryStore from './useRepositoryStore'

export const useQueryRepository = () => {
  const router: NextRouter = useRouter()
  const repositoryName: string = router.query.repository as string
  return trpc.useQuery(['repository.getRepositoryByName', { name: repositoryName }])
}

export const useQueryRepositoryLayer = () => {
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  return trpc.useQuery(['repository.getRepositoryLayers', { id: repositoryId }])
}

export const useQueryCollection = () => {
  const collectionId = useRepositoryStore((state) => state.collectionId)
  return trpc.useQuery(['collection.getCollectionById', { id: collectionId }])
}

export const useMutateRepositoryLayersWeight = () => {
  const ctx = trpc.useContext()
  const { data: layers } = useQueryRepositoryLayer()
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

      // return backup
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
          <span className='text-blueHighlight text-semibold'>{layers?.find((l) => l.id === variables.layerId)?.name}</span>
          <span className='font-semibold'>{` rarities`}</span>
        </div>,
        'rarity changed'
      )
    },
  })
}

export const useMutateRepositoryRule = () => {
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
        draft[primaryId]?.traitElements[Number(primaryTrait.id)]?.rulesPrimary.push({
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
          <span className='text-blueHighlight text-semibold'>
            {backup[primaryId]?.traitElements[Number(primaryTrait.id)]?.name || ''}
          </span>
          <span>{` now ${input.type} `}</span>
          <span className='font-semibold'>{backup[secondaryId]?.traitElements[Number(secondaryTrait.id)]?.name}</span>
        </div>,
        'new rule'
      )

      return { backup }
    },
    onError: (err, variables, context) => {
      if (!context?.backup) return
      ctx.setQueryData(['repository.getRepositoryLayers', { id: variables.repositoryId }], context.backup)
    },
    onSettled: () => ctx.invalidateQueries(['repository.getRepositoryLayers']),
  })
}
