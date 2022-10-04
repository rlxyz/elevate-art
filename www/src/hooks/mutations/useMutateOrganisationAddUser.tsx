import { trpc } from '@utils/trpc'

export const useMutateOrganisationAddUser = () => {
  return trpc.useMutation('organisation.addUser', {
    onMutate: () => {},
    onError: () => {},
  })
}
