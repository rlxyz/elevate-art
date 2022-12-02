import produce from 'immer'
import { trpc } from 'src/client/utils/trpc'
import { useMutationContext } from '../useMutationContext'

export const useMutateOrganisationMemberDelete = () => {
  const { ctx, repositoryId, notifyError, notifySuccess } = useMutationContext()
  return trpc.organisation.memberDelete.useMutation({
    onSuccess: (data, variables) => {
      const { organisationId } = variables
      ctx.organisation.findAll.setData(undefined, (old) => {
        if (!old) return old

        const next = produce(old, (draft) => {
          // find the organisation with organisationId
          const index = draft.findIndex((o) => o.id === organisationId)
          if (!index) return old
          draft.splice(index, 1)
        })

        notifySuccess('You have successfully left the team')
        return next
      })
    },
    onError: (err) => {
      notifyError(err.message)
    },
  })
}
