import { trpc } from '@utils/trpc'
import produce from 'immer'
import useRepositoryStore from 'src/client/hooks/store/useRepositoryStore'
import { useNotification } from 'src/client/hooks/utils/useNotification'

export const useMutateRenameLayerElement = () => {
  const ctx = trpc.useContext()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const { notifyError, notifySuccess } = useNotification()
  return trpc.useMutation('layers.update.name', {
    onSuccess: async (data, variables) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await ctx.cancelQuery(['layers.getAll', { id: repositoryId }])

      // Snapshot the previous value
      const backup = ctx.getQueryData(['layers.getAll', { id: repositoryId }])
      if (!backup) return { backup }

      // Optimistically update to the new value
      const next = produce(backup, (draft) => {
        variables.layerElements.forEach(({ layerElementId, name }) => {
          const layer = draft.find((x) => x.id === layerElementId)
          if (!layer) return
          layer.name = name
        })
      })

      // Save
      ctx.setQueryData(['layers.getAll', { id: repositoryId }], next)

      // Notify
      notifySuccess(`Successfully renamed layer`)
    },
    onError: (error) => {
      notifyError('Something went wrong...')
    },
  })
}
