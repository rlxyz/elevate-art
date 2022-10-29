import { useQueryOrganisation } from '@hooks/query/useQueryOrganisation'
import { trpc } from '@utils/trpc'
import produce from 'immer'
import { useSession } from 'next-auth/react'

export const useMutateAcceptInvitation = () => {
  const ctx = trpc.useContext()
  const { data: session } = useSession()
  const { pendings } = useQueryOrganisation()
  return trpc.useMutation('organisation.acceptInvitation', {
    onSuccess: async (data, input) => {
      if (!session?.user?.id) return
      const userId = session.user.id
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await ctx.cancelQuery(['organisation.getManyOrganisationByUserId'])
      await ctx.cancelQuery(['organisation.getManyPendingOrganisationByUserId'])

      // Snapshot the previous value
      const backupOrganisations = ctx.getQueryData(['organisation.getManyOrganisationByUserId'])
      const backupPending = ctx.getQueryData(['organisation.getManyPendingOrganisationByUserId'])
      if (!backupOrganisations || !backupPending) return { backupOrganisations, backupPending }

      const organisationPending = pendings?.find((x) => x.id === input.pendingId)
      if (!organisationPending) return { backupOrganisations, backupPending }

      // Optimistically update to the new value
      const next = produce(backupOrganisations, (draft) => {
        draft.push({
          ...organisationPending.organisation,
          _count: {
            repositories: 0,
          },
          members: [
            {
              id: organisationPending.id,
              type: organisationPending.role,
              userId: userId,
              organisationId: organisationPending.organisationId,
              user: {
                id: userId,
                name: '',
                email: '',
                emailVerified: new Date(),
                address: '',
                image: '',
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          pendings: [],
        })
      })
      ctx.setQueryData(['organisation.getManyOrganisationByUserId'], next)

      const nextPending = produce(backupPending, (draft) => {
        draft.splice(
          draft.findIndex((x) => x.id === input.pendingId),
          1
        )
      })

      console.log({ nextPending, next })
      ctx.setQueryData(['organisation.getManyPendingOrganisationByUserId'], nextPending)

      // return backup
      return { backupOrganisations, backupPending }
    },
  })
}
