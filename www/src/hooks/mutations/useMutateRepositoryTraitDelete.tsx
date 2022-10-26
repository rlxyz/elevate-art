import useRepositoryStore from '@hooks/store/useRepositoryStore'
import { useNotification } from '@hooks/utils/useNotification'
import { trpc } from '@utils/trpc'
import produce from 'immer'
import { useQueryRepositoryLayer } from '../query/useQueryRepositoryLayer'

export const useMutateRepositoryDeleteTrait = () => {
  const ctx = trpc.useContext()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const { all: layers, isLoading } = useQueryRepositoryLayer()
  const { notifySuccess } = useNotification()
  return trpc.useMutation('trait.delete', {
    onSuccess: (data, variable) => {
      const backup = ctx.getQueryData(['repository.getRepositoryLayers', { id: repositoryId }])
      if (!backup) return { backup }

      const next = produce(backup, (draft) => {
        const trait = draft.flatMap((x) => x.traitElements).find((x) => x.id === variable.id)
        if (!trait) return
        const layer = draft.find((x) => x.id === trait.layerElementId)
        if (!layer) return
        layer.traitElements.find((x) => x.id === variable.id)

        notifySuccess(`Deleted ${primaryTrait.name} ${input.condition} ${secondaryTrait.name} rule`)
      })
    },
  })
}
