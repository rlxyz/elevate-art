import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { useNotification } from '@hooks/utils/useNotification'
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
      await ctx.cancelQuery(['repository.getRepositoryLayers', { id: repositoryId }])

      // Snapshot the previous value
      const backup = ctx.getQueryData(['repository.getRepositoryLayers', { id: repositoryId }])
      if (!backup) return { backup }

      // Optimistically update to the new value
      const next = produce(backup, (draft) => {
        Object.entries(data).map(([layerElementId, traitElements]) => {
          const layer = draft.find((l) => l.id === layerElementId)
          if (!layer) return
          const ids = traitElements.map((x) => x.id)
          layer.traitElements = layer.traitElements.filter((x) => ids.includes(x.id))
        })
      })

      // Save
      ctx.setQueryData(['repository.getRepositoryLayers', { id: repositoryId }], next)
    },
    onError: (err, variables, context) => {
      notifyError('Something went wrong when deleting the traits')
    },
  })
}
