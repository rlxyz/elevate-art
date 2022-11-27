import produce from 'immer'
import useRepositoryStore from 'src/client/hooks/store/useRepositoryStore'
import { useNotification } from 'src/client/hooks/utils/useNotification'
import { trpc } from 'src/client/utils/trpc'

export const useMutateTraitElementUpdateName = () => {
  const ctx = trpc.useContext()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const { notifyError } = useNotification()
  return trpc.traitElement.updateName.useMutation({
    onSuccess: async (data, variable) => {
      /** Get the Change */
      const { traitElements } = variable

      /** Update the cache */
      ctx.layerElement.findAll.setData({ repositoryId }, (old) =>
        produce(old, (draft) => {
          if (!draft) return

          const allTraits = draft.flatMap((x) => x.traitElements)
          traitElements.forEach(({ traitElementId, name }) => {
            const trait = allTraits.find((x) => x.id === traitElementId)
            if (!trait) return
            trait.name = name
          })
        })
      )
    },
    onError: (err, variables, context) => {
      notifyError('Something went wrong when renaming the trait')
    },
  })
}
