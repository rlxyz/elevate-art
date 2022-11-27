import { trpc } from 'src/client/utils/trpc'

// @todo implement on success update
export const useMutateOrganisationSendInvite = () => {
  return trpc.organisation.sendInvite.useMutation()
}
