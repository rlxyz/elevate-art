import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { useNotification } from '@hooks/utils/useNotification'
import { trpc } from '@utils/trpc'
import produce from 'immer'

export const useMutateRepositoryCreateRule = () => {
  const ctx = trpc.useContext()
  const { notifySuccess, notifyError } = useNotification()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  return trpc.useMutation('rules.create', {
    onError: () => {
      notifyError("We couldn't create the rule. Try again.")
    },
    onSuccess: (data) => {
      const backup = ctx.getQueryData(['layers.getAll', { id: repositoryId }])
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
          secondaryTraitElement: secondaryTrait,
          primaryTraitElement: primaryTrait,
        })
      })
      ctx.setQueryData(['layers.getAll', { id: repositoryId }], next)
      notifySuccess(`${data.primaryTraitElement.name} now ${data.condition} ${data.primaryTraitElement.name}`)
    },
  })
}
