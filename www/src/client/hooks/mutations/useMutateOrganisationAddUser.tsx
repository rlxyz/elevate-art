import { trpc } from 'src/client/utils/trpc'

// @todo implement on success update
export const useMutateOrganisationAddUser = () => {
  return trpc.organisation.sendInvite.useMutation()
}
