import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { useNotification } from '@hooks/utils/useNotification'
import { trpc } from '@utils/trpc'
import produce from 'immer'

export const useMutateDeleteRule = () => {
  const ctx = trpc.useContext()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const { notifySuccess, notifyError } = useNotification()
  return trpc.useMutation('rules.delete', {
    onSuccess: async (data) => {
      const backup = ctx.getQueryData(['layers.getAll', { id: repositoryId }])
      if (!backup) return { backup }

      const next = produce(backup, (draft) => {
        const allTraitElements = draft.flatMap((x) => x.traitElements)

        /** Get the Traits */
        const primary = allTraitElements.find((l) => l.id === data.primaryTraitElementId)
        const secondary = allTraitElements.find((l) => l.id === data.secondaryTraitElementId)
        if (typeof primary === 'undefined' || typeof secondary === 'undefined') return

        /** Find the index of the rules in their assocaited TraitElement */
        const ruleIndexPrimary = primary.rulesPrimary.findIndex((r) => r.id === data.id)
        const ruleIndexSecondary = secondary.rulesSecondary.findIndex((r) => r.id === data.id)
        if (ruleIndexPrimary < 0 || ruleIndexSecondary < 0) return

        /** Remove rule  */
        primary.rulesPrimary.splice(ruleIndexPrimary, 1)
        secondary.rulesSecondary.splice(ruleIndexSecondary, 1)

        notifySuccess(`Deleted ${primary.name} ${data.condition} ${secondary.name} rule`)
      })

      ctx.setQueryData(['layers.getAll', { id: repositoryId }], next)

      // Notify Success
      return { backup }
    },
    onError: () => {
      notifyError("We couldn't create the rule. Try again.")
    },
  })
}
