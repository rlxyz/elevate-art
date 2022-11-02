import { useNotification } from '@hooks/utils/useNotification'
import { trpc } from '@utils/trpc'

export const useMutateRenameTraitElement = () => {
  const { notifySuccess, notifyError } = useNotification()
  return trpc.useMutation('traits.rename', {
    onSuccess: async (data, variable) => {},
    onError: (err, variables, context) => {
      notifyError('Something went wrong when deleting the traits')
    },
  })
}
