import { useNotification } from '@hooks/utils/useNotification'
import produce from 'immer'
import { useSession } from 'next-auth/react'
import { useQueryOrganisation } from 'src/client/hooks/query/useQueryOrganisation'
import { trpc } from 'src/client/utils/trpc'

export const useMutateAcceptInvitation = () => {
  const ctx = trpc.useContext()
  const { data: session } = useSession()
  const { pendings } = useQueryOrganisation()
  const { notifySuccess, notifyError } = useNotification()
  return trpc.organisation.acceptInvite.useMutation({
    onSuccess: (data, input) => {
      if (!session?.user?.id) return
      const userId = session.user.id

      // Snapshot the previous value
      const backupOrganisations = ctx.organisation.findAll.getData()
      const backupPending = ctx.organisation.findAllInvites.getData()
      if (!backupOrganisations || !backupPending) return

      const organisationPending = pendings?.find((x) => x.id === input.pendingId)
      if (!organisationPending) return

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

      ctx.organisation.findAll.setData(undefined, next)

      const nextPending = produce(backupPending, (draft) => {
        draft.splice(
          draft.findIndex((x) => x.id === input.pendingId),
          1
        )
      })

      ctx.organisation.findAllInvites.setData(undefined, nextPending)

      notifySuccess(`You have succcessfully accepted the invite`)
    },
    onError: (err, variables, context) => {
      notifyError('Something went wrong when accepting the invite')
    },
  })
}
