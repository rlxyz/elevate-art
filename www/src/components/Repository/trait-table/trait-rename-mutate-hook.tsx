import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { useNotification } from '@hooks/utils/useNotification'
import { trpc } from '@utils/trpc'
import produce from 'immer'

export const useMutateRenameTraitElement = () => {
  const ctx = trpc.useContext()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const { notifySuccess, notifyError } = useNotification()
  return trpc.useMutation('traits.rename', {
    onSuccess: async (data, variable) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await ctx.cancelQuery(['layers.getAll', { id: repositoryId }])

      // Snapshot the previous value
      const backup = ctx.getQueryData(['layers.getAll', { id: repositoryId }])
      if (!backup) return { backup }

      // Optimistically update to the new value
      const next = produce(backup, (draft) => {
        const allTraits = draft.flatMap((x) => x.traitElements)
        variable.traitElements.forEach(({ traitElementId, name }) => {
          const trait = allTraits.find((x) => x.id === traitElementId)
          if (!trait) return
          notifySuccess(`You have changed the trait with name ${trait.name} to ${name}`)
          trait.name = name
        })
      })

      // Save
      ctx.setQueryData(['layers.getAll', { id: repositoryId }], next)
    },
    onError: (err, variables, context) => {
      notifyError('Something went wrong when deleting the traits')
    },
  })
}
