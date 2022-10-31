import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { useNotification } from '@hooks/utils/useNotification'
import { trpc } from '@utils/trpc'
import produce from 'immer'
import { useQueryRepositoryLayer } from '../query/useQueryRepositoryLayer'

export const useMutateDeleteTrait = () => {
  const ctx = trpc.useContext()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const { all: layers, isLoading } = useQueryRepositoryLayer()
  const { notifySuccess } = useNotification()
  return trpc.useMutation('traits.deleteMany', {
    onSuccess: (data, variable) => {
      const backup = ctx.getQueryData(['repository.getRepositoryLayers', { id: repositoryId }])
      if (!backup) return { backup }

      const next = produce(backup, (draft) => {
        variable.ids.forEach((id) => {
          const trait = draft.flatMap((x) => x.traitElements).find((x) => x.id === id)
          if (!trait) return
          const layer = draft.find((x) => x.id === trait.layerElementId)
          if (!layer) return
          layer.traitElements = layer.traitElements.filter((x) => x.id !== id)
          notifySuccess(`Deleted ${trait.name} from ${layer.name}`)
        })
      })

      ctx.setQueryData(['repository.getRepositoryLayers', { id: repositoryId }], next)
    },
  })
}
