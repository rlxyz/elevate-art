import { useNotification } from '@hooks/utils/useNotification'
import { trpc } from '@utils/trpc'

// @todo implement on success update
export const useMutateOrganisationAddUser = () => {
  const { notifySuccess } = useNotification()
  return trpc.useMutation('organisation.addUser', {
    onSuccess: (data) => {
      notifySuccess('New user added to organisation. It may take a few minutes for the changes to take reflect on the app.')
    },
  })
}
