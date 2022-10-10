import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { useNotification } from '@hooks/utils/useNotification'
import { trpc } from '@utils/trpc'
import produce from 'immer'

export const useMutateRepositoryDeleteRule = () => {
  const ctx = trpc.useContext()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const { notifySuccess } = useNotification()
  return trpc.useMutation('rules.delete', {
    onMutate: async (input) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await ctx.cancelQuery(['repository.getRepositoryLayers', { id: repositoryId }])

      // Snapshot the previous value
      const backup = ctx.getQueryData(['repository.getRepositoryLayers', { id: repositoryId }])
      if (!backup) return { backup }

      const next = produce(backup, (draft) => {
        const primaryId = draft.findIndex((l) => l.id === input.primaryLayerElementId)
        const secondaryId = draft.findIndex((l) => l.id === input.secondaryLayerElementId)
        const primaryTrait = draft[primaryId]?.traitElements.find((t) => t.id === input.primaryTraitElementId)
        const secondaryTrait = draft[secondaryId]?.traitElements.find((t) => t.id === input.secondaryTraitElementId)

        if (typeof primaryTrait === 'undefined' || typeof secondaryTrait === 'undefined') return

        const ruleIndexPrimary = primaryTrait.rulesPrimary.findIndex((r) => r.id === input.id)
        const ruleIndexSecondary = secondaryTrait.rulesSecondary.findIndex((r) => r.id === input.id)
        primaryTrait.rulesPrimary.splice(ruleIndexPrimary, 1)
        secondaryTrait.rulesSecondary.splice(ruleIndexSecondary, 1)
        notifySuccess(`${primaryTrait.name} now ${'@todo'} ${secondaryTrait.name}`)
      })

      ctx.setQueryData(['repository.getRepositoryLayers', { id: repositoryId }], next)

      // Notify Success
      return { backup }
    },
    onError: (err, variables, context) => {
      if (!context?.backup) return
      ctx.setQueryData(['repository.getRepositoryLayers', { id: repositoryId }], context.backup)
    },
    onSettled: (data) => ctx.invalidateQueries(['repository.getRepositoryLayers', { id: repositoryId }]),
  })
}
