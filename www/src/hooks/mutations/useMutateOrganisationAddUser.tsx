import { trpc } from '@utils/trpc'

// @todo implement this
export const useMutateOrganisationAddUser = () => {
  return trpc.useMutation('organisation.addUser')
}
