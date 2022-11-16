import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { useNotification } from '@hooks/utils/useNotification'
import { trpc } from '@utils/trpc'
import produce from 'immer'

export const useMutateCreateLayerElement = () => {
  const ctx = trpc.useContext()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const { notifyError, notifySuccess } = useNotification()

  return trpc.useMutation('layers.create', {
    onSuccess: async (data) => {
      // Notify
      notifySuccess(`You have created a new layer called ${data.name}.`)

      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await ctx.cancelQuery(['layers.getAll', { id: repositoryId }])

      // Snapshot the previous value
      const backup = ctx.getQueryData(['layers.getAll', { id: repositoryId }])
      if (!backup) return { backup }

      // Optimistically update to the new value
      const next = produce(backup, (draft) => {
        draft.push({
          ...data,
          traitElements: [],
        })
      })

      // Save
      ctx.setQueryData(['layers.getAll', { id: repositoryId }], next)
    },
    onError: (err) => {
      notifyError(err.message)
    },
  })
}
