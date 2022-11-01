import { trpc } from '@utils/trpc'

// @todo implement on success update
export const useMutateOrganisationAddUser = () => {
  return trpc.useMutation('organisation.user.invite.send')
}
