import produce from 'immer'
import useRepositoryStore from 'src/client/hooks/store/useRepositoryStore'
import { useNotification } from 'src/client/hooks/utils/useNotification'
import { trpc } from 'src/client/utils/trpc'
import { RulesType } from 'src/shared/compiler'

export const useMutateCreateRule = () => {
  const ctx = trpc.useContext()
  const { notifySuccess, notifyError } = useNotification()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  return trpc.rule.create.useMutation({
    onSuccess: (data, variables) => {
      const backup = ctx.layerElement.findAll.getData({ repositoryId })
      if (!backup) return
      const next = produce(backup, (draft) => {
        const allTraitElements = draft.flatMap((x) => x.traitElements)

        /** Get the Traits */
        const primary = allTraitElements.find((l) => l.id === variables.traitElements[0])
        const secondary = allTraitElements.find((l) => l.id === variables.traitElements[1])
        if (typeof primary === 'undefined' || typeof secondary === 'undefined') return

        /** Update their associated Rules */
        primary.rulesPrimary.push({
          id: data.id,
          condition: data.condition as RulesType,
          primaryTraitElement: primary,
          secondaryTraitElement: secondary,
          primaryTraitElementId: primary.id,
          secondaryTraitElementId: secondary.id,
        })

        /** Notify of the change! */
        notifySuccess(`${primary.name} now ${data.condition} ${secondary.name}`)
      })

      ctx.layerElement.findAll.setData({ repositoryId }, next)
    },
    onError: () => {
      notifyError("We couldn't create the rule. Try again.")
    },
  })
}
