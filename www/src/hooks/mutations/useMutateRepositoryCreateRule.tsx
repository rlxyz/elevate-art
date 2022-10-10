import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { useNotification } from '@hooks/utils/useNotification'
import { trpc } from '@utils/trpc'
import produce from 'immer'

export const useMutateRepositoryCreateRule = () => {
  const ctx = trpc.useContext()
  const { notifySuccess, notifyError } = useNotification()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  return trpc.useMutation('rules.create', {
    // Optimistic Update
    onMutate: async (input) => {
      // // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      // await ctx.cancelQuery(['repository.getRepositoryLayers', { id: repositoryId }])
      // // Snapshot the previous value
      // const backup = ctx.getQueryData(['repository.getRepositoryLayers', { id: repositoryId }])
      // if (!backup) return { backup }
      // // Get indexes of the traits
      // const primaryId = backup.findIndex((l) => l.id === input.primaryLayerElementId)
      // const secondaryId = backup.findIndex((l) => l.id === input.secondaryLayerElementId)
      // const primaryTrait = backup[primaryId]?.traitElements.find((t) => t.id === input.primaryTraitElementId)
      // const secondaryTrait = backup[secondaryId]?.traitElements.find((t) => t.id === input.secondaryTraitElementId)
      // if (typeof primaryTrait === 'undefined' || typeof secondaryTrait === 'undefined') return { backup }
      // // Optimistically update to the new value
      // const next = produce(backup, (draft) => {
      //   draft[primaryId]?.traitElements[Number(primaryId)]?.rulesPrimary.push({
      //     id: 'temp',
      //     condition: input.type,
      //     secondaryTraitElementId: input.secondaryTraitElementId,
      //     primaryTraitElementId: input.primaryTraitElementId,
      //     secondaryTraitElement: {
      //       ...secondaryTrait,
      //       layerElement: {
      //         id: secondaryTrait.layerElementId,
      //         name: draft[secondaryId]?.name ?? '',
      //         priority: draft[secondaryId]?.priority ?? 0,
      //         repositoryId: draft[secondaryId]?.repositoryId ?? '',
      //         createdAt: new Date(),
      //         updatedAt: new Date(),
      //       },
      //     },
      //     primaryTraitElement: {
      //       ...primaryTrait,
      //       layerElement: {
      //         id: primaryTrait.layerElementId,
      //         name: draft[primaryId]?.name ?? '',
      //         priority: draft[primaryId]?.priority ?? 0,
      //         repositoryId: draft[primaryId]?.repositoryId ?? '',
      //         createdAt: new Date(),
      //         updatedAt: new Date(),
      //       },
      //     },
      //   })
      // })
      // ctx.setQueryData(['repository.getRepositoryLayers', { id: repositoryId }], next)
      // console.log('done')
      // // Notify Success
      // // notifySuccess(`${primaryTrait.name} now ${input.type} ${secondaryTrait.name}`)
      // // onMutate && onMutate()
      // return { backup }
    },
    onError: (err, variables, context) => {
      // if (!context?.backup) return
      // notifyError("We reverted the new rule because it couldn't be created")
      // ctx.setQueryData(['repository.getRepositoryLayers', { id: repositoryId }], context.backup)
    },
    onSettled: (data) => ctx.invalidateQueries(['repository.getRepositoryLayers', { id: repositoryId }]),
    onSuccess: (data, variables) => {
      const backup = ctx.getQueryData(['repository.getRepositoryLayers', { id: repositoryId }])
      if (!backup) return
      const primaryId = backup.findIndex((l) => l.id === data.primaryTraitElement.layerElementId)
      const secondaryId = backup.findIndex((l) => l.id === data.secondaryTraitElement.layerElementId)
      const primaryTrait = backup[primaryId]?.traitElements.find((t) => t.id === data.primaryTraitElementId)
      const secondaryTrait = backup[secondaryId]?.traitElements.find((t) => t.id === data.secondaryTraitElementId)
      if (typeof primaryTrait === 'undefined' || typeof secondaryTrait === 'undefined') return
      const next = produce(backup, (draft) => {
        draft[primaryId]?.traitElements[Number(primaryId)]?.rulesPrimary.push({
          id: data.id,
          condition: data.condition,
          primaryTraitElementId: data.primaryTraitElementId,
          secondaryTraitElementId: data.secondaryTraitElementId,
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
      ctx.setQueryData(['repository.getRepositoryLayers', { id: repositoryId }], next)
      notifySuccess(`${data.primaryTraitElement.name} now ${data.condition} ${data.primaryTraitElement.name}`)
    },
  })
}
