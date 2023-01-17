import produce from 'immer'
import { trpc } from 'src/client/utils/trpc'
import { useMutationContext } from '../useMutationContext'

export const useMutateRuleCreate = () => {
  const { ctx, repositoryId, notifyError, notifySuccess } = useMutationContext()
  return trpc.rule.create.useMutation({
    onSuccess: (data, variables) => {
      ctx.layerElement.findAll.setData({ repositoryId }, (old) => {
        if (!old) return old
        const next = produce(old, (draft) => {
          const allTraitElements = draft.flatMap((x) => x.traitElements)

          /** Get the Traits */
          const primary = allTraitElements.find((l) => l.id === variables.traitElements[0])
          const secondary = allTraitElements.find((l) => l.id === variables.traitElements[1])
          if (typeof primary === 'undefined' || typeof secondary === 'undefined') return

          /** Update their associated Rules */
          primary.rulesPrimary.push({
            id: data.id,
            condition: data.condition,
            primaryTraitElementId: primary.id,
            secondaryTraitElementId: secondary.id,
          })

          /** Notify of the change! */
          notifySuccess(`${primary.name} now ${data.condition} ${secondary.name}`)
        })

        return next
      })
    },
    onError: () => {
      notifyError("We couldn't create the rule. Try again...")
    },
  })
}
