import produce from 'immer'
import { trpc } from 'src/client/utils/trpc'
import { useMutationContext } from '../useMutationContext'

export const useMutateOrganisationDeleteTeam = () => {
  const { ctx, repositoryId, notifyError, notifySuccess } = useMutationContext()
  return trpc.organisation.delete.useMutation({
    onSuccess: (data, variables) => {
      ctx.organisation.findAll.setData(undefined, (old) => {
        if (!old) return old
        const next = produce(old, (draft) => {
          draft.push(data)
        })
        notifySuccess('Deleted team successfully')
        return next
      })
    },
    onError: (err) => {
      notifyError(err.message)
    },
  })
}
