import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { useNotification } from '@hooks/utils/useNotification'
import { trpc } from '@utils/trpc'
import produce from 'immer'
import { useQueryRepositoryLayer } from '../query/useQueryRepositoryLayer'

export const useMutateCreateTrait = () => {
  const ctx = trpc.useContext()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const { all: layers, isLoading } = useQueryRepositoryLayer()
  const { notifySuccess } = useNotification()
  return trpc.useMutation('traits.create', {
    onSuccess: (data, variable) => {
      const backup = ctx.getQueryData(['repository.getRepositoryLayers', { id: repositoryId }])
      if (!backup) return { backup }

      const next = produce(backup, (draft) => {
        const layer = draft.find((x) => x.id === variable.layerElementId)
        if (!layer) return
        layer.traitElements.push(data)

        notifySuccess(`Create a new trait ${data.name} in ${layer.name}`)
      })

      ctx.setQueryData(['repository.getRepositoryLayers', { id: repositoryId }], next)
    },
  })
}
