import produce from 'immer'
import useRepositoryStore from 'src/client/hooks/store/useRepositoryStore'
import { useNotification } from 'src/client/hooks/utils/useNotification'
import { trpc } from 'src/client/utils/trpc'

export const useMutateLayerElementCreate = () => {
  const ctx = trpc.useContext()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const { notifyError, notifySuccess } = useNotification()

  return trpc.layerElement.create.useMutation({
    onSuccess: async (data) => {
      // Snapshot the previous value
      const backup = ctx.layerElement.findAll.getData({ repositoryId })
      if (!backup) return { backup }

      // Optimistically update to the new value
      const next = produce(backup, (draft) => {
        draft.push({
          ...data,
          traitElements: [],
        })
      })

      // Save
      ctx.layerElement.findAll.setData({ repositoryId }, next)

      // Notify
      notifySuccess(`You have created a new layer called ${data.name}.`)
    },
    onError: (err) => {
      notifyError(err.message)
    },
  })
}
