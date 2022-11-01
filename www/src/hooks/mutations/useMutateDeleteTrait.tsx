import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { useNotification } from '@hooks/utils/useNotification'
import { groupBy } from '@utils/object-utils'
import { trpc } from '@utils/trpc'
import produce from 'immer'

export const useMutateDeleteTrait = () => {
  const ctx = trpc.useContext()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const { notifySuccess, notifyError } = useNotification()
  return trpc.useMutation('traits.delete', {
    onSuccess: async (data, variable) => {
      // Notify
      notifySuccess(`You have delete ${variable.traitElements.length} traits.`)

      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await ctx.cancelQuery(['layers.getAll', { id: repositoryId }])

      // Snapshot the previous value
      const backup = ctx.getQueryData(['layers.getAll', { id: repositoryId }])
      if (!backup) return { backup }

      // Optimistically update to the new value
      const next = produce(backup, (draft) => {
        Object.entries(groupBy(variable.traitElements, (x) => x.layerElementId)).map(([layerElementId, traitElements]) => {
          const layer = draft.find((l) => l.id === layerElementId)
          if (!layer) return
          const ids = traitElements.map((x) => x.id)
          layer.traitElements = layer.traitElements.filter((x) => !ids.includes(x.id))
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
