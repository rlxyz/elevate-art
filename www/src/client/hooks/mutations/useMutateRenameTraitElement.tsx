import produce from 'immer'
import useRepositoryStore from 'src/client/hooks/store/useRepositoryStore'
import { useNotification } from 'src/client/hooks/utils/useNotification'
import { trpc } from 'src/client/utils/trpc'

export const useMutateRenameTraitElement = () => {
  const ctx = trpc.useContext()
  const repositoryId = useRepositoryStore((state) => state.repositoryId)
  const { notifySuccess, notifyError } = useNotification()
  return trpc.traitElement.updateName.useMutation({
    onSuccess: async (data, variable) => {
      // Snapshot the previous value
      const backup = ctx.layerElement.findAll.getData({ repositoryId })
      if (!backup) return { backup }

      // Optimistically update to the new value
      const next = produce(backup, (draft) => {
        const allTraits = draft.flatMap((x) => x.traitElements)
        variable.traitElements.forEach(({ traitElementId, name }) => {
          const trait = allTraits.find((x) => x.id === traitElementId)
          if (!trait) return
          // removed notification to infer inplace mutation
          // notifySuccess(`You have changed the trait with name ${trait.name} to ${name}`)
          trait.name = name
        })
      })

      // Save
      ctx.layerElement.findAll.setData({ repositoryId }, next)
    },
    onError: (err, variables, context) => {
      notifyError('Something went wrong when deleting the traits')
    },
  })
}
